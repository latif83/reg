"use client";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";

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

  return (
    <div>
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
            <p>Abdul-Latif</p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Last Name: </h3>
            <p>Mohammed</p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Staff No.: </h3>
            <p>COMP-HR-2023204</p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Department: </h3>
            <p>HR</p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Address: </h3>
            <p>Tema Community 1</p>
          </div>
        </div>

        <div className="flex justify-end mb-3">
          <button className="bg-blue-600 hover:bg-blue-800 text-white rounded-lg p-2 text-xs">
            Edit Profile
          </button>
        </div>

        <div className="border-b">
          <h1>Things to do</h1>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mt-5">
          <div className="shadow-lg p-3 rounded-lg bg-blue-200 cursor-pointer hover:bg-blue-50">
            Clock in / out
          </div>

          <div className="shadow-lg p-3 rounded-lg bg-blue-200 cursor-pointer hover:bg-blue-50">
            View Attendance History
          </div>

          <div className="shadow-lg p-3 rounded-lg bg-blue-200 cursor-pointer hover:bg-blue-50">
            Book Apointment
          </div>

          <div className="shadow-lg p-3 rounded-lg bg-blue-200 cursor-pointer hover:bg-blue-50">
            View Apointment History
          </div>
        </div>
      </div>
    </div>
  );
}
