"use client";
import {
  faPlus,
  faPlusCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NEmployee } from "./nEmplyee";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Employees() {
  const [addEmployee, setAddEmployee] = useState(false);

  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(false);

  const [gData, setGData] = useState(true);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/employee");
        const responseData = await response.json();
        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        // toast.success(responseData.message)

        // console.log(responseData.employees)

        setEmployees(responseData.employees);
        setLoading(false);
      } catch (err) {
        console.log(err);
        toast.error("Error retrieving data, please try again!");
      }
    };

    if (gData) {
      getEmployees();
      setGData(false);
    }
  }, [gData]);

  return (
    <div>
      {addEmployee && <NEmployee setAddEmployee={setAddEmployee} />}
      <h1>Employees</h1>

      <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
        <div class="p-4 bg-gray-800 flex justify-between">
          <div>
            <label for="table-search" class="sr-only">
              Search
            </label>
            <div class="relative mt-1">
              <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                class="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search employees"
              />
            </div>
          </div>
          <div>
            <button
              onClick={() => setAddEmployee(true)}
              className="p-2 rounded-lg bg-gray-50 flex gap-2 items-center hover:bg-gray-200 text-sm"
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              New Employee
            </button>
          </div>
        </div>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">
                Staff Id
              </th>
              <th scope="col" class="px-6 py-3">
                Name
              </th>
              <th scope="col" class="px-6 py-3">
                Email
              </th>
              <th scope="col" class="px-6 py-3">
                Department
              </th>
              <th scope="col" class="px-6 py-3">
                Contact
              </th>
              <th scope="col" class="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr class="bg-white border-b hover:bg-gray-50">
                <td colSpan={5} class="px-6 py-4 text-center">
                  <FontAwesomeIcon icon={faSpinner} spin /> Loading...
                </td>
              </tr>
            ) : employees.length > 0 ? (
              employees.map((employee) => (
                <tr class="bg-white border-b hover:bg-gray-50">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {employee.staffid}
                  </th>
                  <td class="px-6 py-4">
                    {employee.fname} {employee.lname}
                  </td>
                  <td class="px-6 py-4">
                    {employee.email}
                  </td>
                  <td class="px-6 py-4">{employee.deptId}</td>
                  <td class="px-6 py-4">{employee.contact}</td>
                  <td class="px-6 py-4">
                    <a
                      href="#"
                      class="font-medium text-blue-600 hover:underline"
                    >
                      Manage
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr class="bg-white border-b hover:bg-gray-50">
                <td colSpan={5} class="px-6 py-4 text-center">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
