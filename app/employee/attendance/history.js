"use client";
import Datepicker from "tailwind-datepicker-react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export const AttendanceHistory = ({ loading, attendance,filters,setFilters,setFetchData }) => {
  const [show, setShow] = useState(false);
  const handleChange = (selectedDate) => {
    console.log(selectedDate);
  };
  const handleClose = (state) => {
    setShow(state);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="p-2 mt-5">
        <h1>Reports</h1>

        <div date-rangepicker className="flex items-center my-5">
          <span className="mr-4 text-gray-500">from</span>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </div>
            <input
              name="start"
              type="date"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
              placeholder="Select date start"
value={filters.start}
onChange={(e)=>setFilters((d)=>{return {...d,start:e.target.value}})}
            />
          </div>
          <span className="mx-4 text-gray-500">to</span>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </div>
            <input
              name="end"
              type="date"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
              placeholder="Select date end"
              value={filters.end}
onChange={(e)=>setFilters((d)=>{return {...d,end:e.target.value}})}
            />
          </div>
          <button onClick={()=>setFetchData(true)} className="p-2 rounded-lg bg-blue-700 hover:bg-blue-900 text-white ml-3">
            Filter
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase">
          <tr>
            <th scope="col" className="px-6 py-3 bg-gray-50">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              Time in
            </th>
            <th scope="col" className="px-6 py-3 bg-gray-50">
              Time spent
            </th>
            <th scope="col" className="px-6 py-3">
              Time out
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr class="bg-white border-b hover:bg-gray-50">
              <td colSpan={4} class="px-6 py-4 text-center">
                <FontAwesomeIcon icon={faSpinner} spin /> Loading...
              </td>
            </tr>
          ) : attendance?.length > 0 ? (
            attendance.map((at) => (
              <tr className="border-b border-gray-200">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50"
                >
                  {new Date(at.clockIn).toLocaleDateString()}
                </th>
                <td className="px-6 py-4">
                  {new Date(at.clockIn).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 bg-gray-50">{at.timeDifference}</td>
                <td className="px-6 py-4">
                  {new Date(at.clockOut).toLocaleTimeString()}
                </td>
              </tr>
            ))
          ) : (
            <tr colSpan={4} class="bg-white border-b hover:bg-gray-50">
              {" "}
              <td class="px-6 py-4">No Data found.</td>{" "}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
