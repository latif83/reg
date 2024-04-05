"use client";
import { faPlusCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NDept } from "./nDept";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Departments() {
  const [addDept, setAddDept] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [gData, setGData] = useState(true);

  useEffect(() => {
    const getDepartments = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dept");
        const responseData = await response.json();
        if (!response.ok) {
          toast.error(responseData.error);
          // setLoading(false)
          return;
        }
        console.log(responseData.departments);
        setDepartments(responseData.departments);
        setLoading(false);
        // toast.success(responseData.message)
      } catch (err) {
        console.log(err);
        toast.error("Departments data could not be retrieved!");
      }
    };

    if (gData) {
      getDepartments();
      setGData(false);
    }
  }, [gData]);

  return (
    <div>
      {addDept && <NDept setAddDept={setAddDept} setGData={setGData} />}
      <h1>Departments</h1>

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
                placeholder="Search department"
              />
            </div>
          </div>
          <div>
            <button
              onClick={() => setAddDept(true)}
              className="p-2 rounded-lg bg-gray-50 flex gap-2 items-center hover:bg-gray-200 text-sm"
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              New Department
            </button>
          </div>
        </div>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">
                Department
              </th>
              <th scope="col" class="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr class="bg-white border-b hover:bg-gray-50">
                <td colSpan={2} class="px-6 py-4">
                  <FontAwesomeIcon icon={faSpinner} spin color="red" /> Loading
                  Departments...
                </td>
              </tr>
            ) : departments.length > 0 ? (
              departments.map((dept) => (
                <tr class="bg-white border-b hover:bg-gray-50">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {dept.name}
                  </th>
                  <td class="px-6 py-4 flex gap-4">
                    <a
                      href="#"
                      class="font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      class="font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr class="bg-white border-b hover:bg-gray-50">
                <td colSpan={2} class="px-6 py-4">No Departments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
