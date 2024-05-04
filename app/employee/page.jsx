"use client";
import { faSpinner, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { EditProfile } from "./editProfile";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EmployeeDashboard() {
  // State to hold the current time
  const [currentTime, setCurrentTime] = useState("");

  // Function to update the current time
  const updateTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    setCurrentTime(formattedTime);
  };

  // useEffect hook to update the time initially and start the interval
  useEffect(() => {
    updateTime(); // Update the time initially
    // Set up interval to update time every second (1000ms)
    const interval = setInterval(updateTime, 1000);
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const [employeeInfo, setEmployeeInfo] = useState({});
  const [empLoading, setEmpLoading] = useState(false);
  const [gData, setGData] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const getEmployeeInfo = async () => {
      try {
        setEmpLoading(true);
        const empId = "unkwown";
        const response = await fetch(`/api/employee/${empId}`);
        const responseData = await response.json();
        if (!response.ok) {
          toast.error(responseData.error);

          if (responseData?.redirect) {
            router.push("/");
          }

          return;
        }

        setEmployeeInfo(responseData.employee);

        // console.log(responseData.employee);

        setEmpLoading(false);
      } catch (err) {
        console.log(err);
        toast.error("Error retrieving data, please try again later!");
      }
    };

    if (gData) {
      getEmployeeInfo();
      setGData(false);
    }
  }, [gData]);

  const [editProfile, setEditProfile] = useState(false);

  return (
    <div>
      {editProfile && (
        <EditProfile
          setEditProfile={setEditProfile}
          empData={employeeInfo}
          setGData={setGData}
        />
      )}
      <div className="border-b pb-3 flex sm:flex-row flex-col justify-between items-center">
        <h1 className="font-bold text-xl">Employee Dashboard</h1>
        <div>
          {/* Display the current time */}
          <p>{currentTime}</p>
        </div>
      </div>

      <div className="mt-5">
        {/* <h1 className="text-2xl">Employee</h1> */}

        {/* <div className="mb-5">
        <FontAwesomeIcon icon={faUserCircle} className="h-16 w-16" />
       </div> */}

        <div className="grid sm:grid-cols-3 grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-xs text-red-500">First Name: </h3>
            <p>
              {empLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                employeeInfo?.fname
              )}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Last Name: </h3>
            <p>
              {empLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                employeeInfo?.lname
              )}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Staff No.: </h3>
            <p>
              {empLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                employeeInfo?.staffid
              )}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Department: </h3>
            <p>
              {empLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                employeeInfo?.department?.name
              )}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Address: </h3>
            <p>
              {empLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                employeeInfo?.address
              )}
            </p>
          </div>
        </div>

        <div className="flex justify-end mb-3">
          <button
            onClick={() => setEditProfile(true)}
            className="bg-blue-600 hover:bg-blue-800 text-white rounded-lg p-2 text-xs"
          >
            Edit Profile
          </button>
        </div>

        <div className="border-b">
          <h1>Things to do</h1>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mt-5">
          <Link
            href="/employee/attendance"
            className="shadow-lg p-3 rounded-lg bg-blue-200 cursor-pointer hover:bg-blue-50"
          >
            Clock in / out
          </Link>

          <Link href="/employee/attendance" className="shadow-lg p-3 rounded-lg bg-blue-200 cursor-pointer hover:bg-blue-50">
            View Attendance History
          </Link>

          <Link href="/employee/appointment" className="shadow-lg p-3 rounded-lg bg-blue-200 cursor-pointer hover:bg-blue-50">
            Book Apointment
          </Link>

          <Link href="/employee/appointments" className="shadow-lg p-3 rounded-lg bg-blue-200 cursor-pointer hover:bg-blue-50">
            View Apointment History
          </Link>
        </div>
      </div>
    </div>
  );
}
