import { useEffect, useState } from "react";
import Badge from "./Badge";

const Table = () => {
  const [policyList, setPolicyList] = useState([]);
  const [errorState, setErrorState] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPolicies('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPolicies = async (filter: string) => {
    try {
      const policies = await (await fetch("http://localhost:4000/policies?" + new URLSearchParams({search}))).json();
      setPolicyList(policies);
    } catch (error) {
      console.log(error);
      setErrorState('Error');
    }
  };

  const filterPolicies = () => {
    fetchPolicies(search);
  };

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);  
  }

  if (errorState !== "") {
    return <p>{errorState}</p>
  } else {
    return (
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-lg shadow-sm">
              <input className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                     type="text"
                     name="search"
                     value={search}
                     onChange={handleInput}
                     placeholder="Enter Name/Provider" />
              <button className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-600 hover:bg-gray-700"
                      onClick={() => filterPolicies()}>Filter</button>
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
                  {policyList.map((policy: any) => (
                    <tr className="border-b" key={policy.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1</td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {policy.customer.firstName + ' ' + policy.customer.lastName}
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