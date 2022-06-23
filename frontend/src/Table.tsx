import { useEffect, useState } from "react";
import Badge from "./Badge";

const Table = () => {
  const [policyList, setPolicyList] = useState([]);
  const [errorState, setErrorState] = useState('');
  const [filterState, setFilterState] = useState({
    nameProvider: '',
    type: 'Type',
    status: 'Status',
  });

  useEffect(() => {
    fetchPolicies(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPolicies = async (hasFilters: boolean) => {
    try {
      const fetchURL = "http://localhost:4000/policies?" + 
                       new URLSearchParams({nameProviderFilter: hasFilters ? filterState.nameProvider : '', 
                                            typeFilter: hasFilters ? filterState.type : 'Type',
                                            statusFilter: hasFilters ? filterState.status : 'Status'});
      const response = await fetch(fetchURL);
      const policies = await response.json();
      setPolicyList(policies);
    } catch (error) {
      console.log(error);
      setErrorState('Error');
    }
  };

  const filterPolicies = () => {
    fetchPolicies(true);
  };

  const clearFilters = () => {
    setFilterState({
      nameProvider: '',
      type: 'Type',
      status: 'Status',
    });
    fetchPolicies(false);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState({
      ...filterState,
      nameProvider: event.currentTarget.value
    });  
  };

  const handleSelectType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState({
      ...filterState,
      type: event.currentTarget.value
    }); 
  };

  const handleSelectStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState({
      ...filterState,
      status: event.currentTarget.value
    }); 
  };

  if (errorState !== "") {
    return <p>{errorState}</p>
  } else {
    return (
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-lg shadow-sm">
              <div className="flex flex-row">
                <input className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      name="search"
                      value={filterState.nameProvider}
                      onChange={handleInput}
                      placeholder="Enter Name/Provider" />
                <select className="block appearance-none w-40 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        value={filterState.type}
                        onChange={handleSelectType}>
                  <option>Type</option>
                  <option>LIABILITY</option>
                  <option>HOUSEHOLD</option>
                  <option>HEALTH</option>
                </select>
                <select className="block appearance-none w-40 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        value={filterState.status}
                        onChange={handleSelectStatus}>
                  <option>Status</option>
                  <option>ACTIVE</option>
                  <option>PENDING</option>
                </select>
                <button className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-600 hover:bg-gray-700"
                        onClick={filterPolicies}>Filter
                </button>
                <button className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-blue bg-white-600 hover:bg-white-700"
                        onClick={clearFilters}>Clear
                </button>
              </div>
              <table className="min-w-full">
                <thead className="border-b bg-gray-100">
                  <tr>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      #
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Name
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Provider
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Type
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {policyList.map((policy: any, index) => (
                    <tr className="border-b" key={policy.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {policy.customer.firstName} {policy.customer.lastName}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {policy.provider}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {policy.insuranceType}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        <Badge status={policy.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
)
  }

  
}

export default Table;