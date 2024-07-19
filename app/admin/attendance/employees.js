"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./newCode.module.css";
import { faSpinner, faTimes, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export const EmployeesAttendance = ({ setViewAttendance, attendanceCode }) => {
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(false);

  // const [gData, setGData] = useState(true);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/attendance/emp?attendanceCode=${attendanceCode}`
        );
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

    getEmployees();
  }, []);

  return (
    <div className={`${styles.container} flex pt-12 justify-center`}>
      <div
        className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6"
        style={{ flexGrow: 0, height: "max-content" }}
      >
        <div className="flex justify-between">
          <h1 className="font-semibold">Employees</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setViewAttendance(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>

        <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Employee
                </th>
                <th scope="col" class="px-6 py-3">
                  Department
                </th>
                <th scope="col" class="px-6 py-3">
                  Time in
                </th>
                <th scope="col" class="px-6 py-3">
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
              ) : employees.length > 0 ? (
                employees.map((data) => {

                  const timeIn12HourFormat = (time)=>{
                    return new Date(time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true,
                    });
                  }

                  return(
                  <tr class="bg-white border-b hover:bg-gray-50">
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {data.employee}
                    </th>
                    <td class="px-6 py-4 text-gray-900">
                      {data.department}
                    </td>
                    <td class="px-6 py-4">{timeIn12HourFormat(data.clockIn)}</td>
                    <td class="px-6 py-4">{timeIn12HourFormat(data.clockOut)}</td>
                  </tr>
                )})
              ) : (
                <tr class="bg-white border-b hover:bg-gray-50">
                  <td colSpan={4} class="px-6 py-4 text-center">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
