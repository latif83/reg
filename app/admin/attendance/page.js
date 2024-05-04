"use client";
import {
  faArrowAltCircleRight,
  faPlusCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NewCode } from "./newCode";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EmployeesAttendance } from "./employees";
import { Codes } from "./code";

export default function Attendance() {
  const [createCode, setCreateCode] = useState(false);

  const [attendanceData, setAttendanceData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [gData, setGData] = useState(true);

  const [viewAttendance, setViewAttendance] = useState(false);

  const [attendanceCode, setAttendanceCode] = useState();

  const [code, setCode] = useState("");
  const [viewCode, setViewCode] = useState(false);

  useEffect(() => {
    const getAttendanceData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/attendance/code");
        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        setLoading(false);
        // console.log(responseData)

        // toast.success(responseData.message)
        setAttendanceData(responseData.attendanceCodes);
      } catch (err) {
        console.log(err);
        toast.error("Unexpected error happened!");
      }
    };

    if (gData) {
      getAttendanceData();
      setGData(false);
    }
  }, [gData]);

  return (
    <div>
      {createCode && (
        <NewCode setCreateCode={setCreateCode} setGData={setGData} />
      )}

      {viewAttendance && (
        <EmployeesAttendance
          setViewAttendance={setViewAttendance}
          attendanceCode={attendanceCode}
        />
      )}

      {viewCode && (
        <Codes code={code} setViewCode={setViewCode} />
      )}

      <h1>Attendance</h1>

      <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
        <div class="p-4 flex justify-between">
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
              onClick={() => setCreateCode(true)}
              className="p-2 rounded-lg bg-gray-800 text-white flex gap-2 items-center hover:bg-gray-600 text-sm"
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              New Code
            </button>
          </div>
        </div>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">
                Date
              </th>
              <th scope="col" class="px-6 py-3">
                Attendance Code
              </th>
              <th scope="col" class="px-6 py-3">
                No of Employees Present
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr class="bg-white border-b hover:bg-gray-50">
                <td colSpan={3} class="px-6 py-4 text-center">
                  <FontAwesomeIcon icon={faSpinner} spin /> Loading...
                </td>
              </tr>
            ) : attendanceData.length > 0 ? (
              attendanceData.map((data) => (
                <tr class="bg-white border-b hover:bg-gray-50">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap hover:underline cursor-pointer"
                  >
                    {new Date(data.createdAt).toDateString()}
                  </th>
                  <td
                    onClick={() => {
                      setCode(data.code);
                      setViewCode(true);
                    }}
                    class="px-6 py-4 font-medium text-blue-600 hover:underline cursor-pointer"
                  >
                    {data.code}
                  </td>
                  <td
                    onClick={() => {
                      setViewAttendance(true);
                      setAttendanceCode(data.id);
                    }}
                    class="px-6 py-4 font-medium text-blue-600 hover:underline cursor-pointer"
                  >
                    {data.numEmployeesPresent}
                  </td>
                </tr>
              ))
            ) : (
              <tr class="bg-white border-b hover:bg-gray-50">
                <td colSpan={3} class="px-6 py-4 text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
