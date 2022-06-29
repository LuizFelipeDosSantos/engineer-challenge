import { useEffect, useState } from "react";
import Badge from "./Badge";

const Table = () => {
  const [policyList, setPolicyList] = useState([]);
  const [errorState, setErrorState] = useState('');
  const [filterNameState, setFilterNameState] = useState('');
  const [searchState, setSearchState] = useState('');
  const [showCustomerFamilyMembers, setShowCustomerFamilyMembers] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch("http://localhost:4000/policies?" + new URLSearchParams({search: searchState}));
        const policies = await response.json();
        setPolicyList(policies);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setErrorState('Something went wrong!');
      }
    };

    fetchPolicies();
    setShowCustomerFamilyMembers('');
  }, [searchState]);

  const filterPolicies = () => {
    setIsLoading(true);
    setSearchState(filterNameState);
  };

  const clearFilters = () => {
    setFilterNameState('');
    setSearchState('');
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterNameState(event.currentTarget.value);
  };

  if (errorState !== "") {
    return (
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-lg shadow-sm">
              <p>{errorState}</p>
            </div>
          </div>
        </div>
      </div>
      )
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
                      value={filterNameState}
                      onChange={handleInput}
                      placeholder="Enter Name" />
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
                  {policyList.length > 0 
                   ?
                    policyList.map((policy: any, index) => (
                    <tr className="border-b" key={policy.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {policy.customer.firstName} {policy.customer.lastName}
                        {policy.familyMembers.length > 0
                          && <>
                              <br/>
                              <br/>
                              {showCustomerFamilyMembers === policy.id
                              ? <>
                                  <button className="h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
                                    onClick={() => setShowCustomerFamilyMembers('')}>Hide Family Members
                                  </button>
                                  <br/>
                                  <br/>
                                  <b>Family Members:</b>
                                  {policy.familyMembers.map((familyMember: any) => (
                                    <p key={familyMember.id}> {familyMember.firstName} {familyMember.lastName} </p>
                                  ))}
                                </>
                              : <button className="h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
                                  onClick={() => setShowCustomerFamilyMembers(policy.id)}>Show Family Members
                                </button>
                              }
                            </>
                        }
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
                  ))
                  : <tr className="border-b">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {isLoading ? 'Loading data...' : 'No search results'}
                        </td>
                    </tr>
                  }
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