"use client";
import {
  faPause,
  faSignIn,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { AttendanceHistory } from "./history";

export default function Attendance() {
  // State to hold the current time
  const [currentTime, setCurrentTime] = useState("");

  const [currentDate, setCurrentDate] = useState("");

  // Function to update the current time
  const updateTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    setCurrentTime(formattedTime);
    const formattedDate = now.toDateString();
    setCurrentDate(formattedDate);
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
      <div className="flex flex-col justify-center items-center mt-3">
        <h1 className="text-4xl">{currentTime}</h1>
        <p>{currentDate}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-5">
        <div className="flex flex-col items-center gap-2 justify-center">
          <button className="shadow-lg shadow-blue-500/50 hover:bg-blue-500 ease-in-out duration-500 font-medium rounded-full text-sm px-4 py-3 text-center">
            <FontAwesomeIcon icon={faSignIn} />
          </button>
          <span>Clock in</span>
        </div>

        <div className="flex flex-col items-center gap-2 justify-center">
          <button className="shadow-lg shadow-yellow-500/50 shadow-yellow-200/50 hover:bg-yellow-500 hover:bg-yellow-200 ease-in-out duration-500 font-medium rounded-full text-sm px-4 py-3 text-center">
            <FontAwesomeIcon icon={faPause} />
          </button>
          <span className="text-gray-200">Break</span>
        </div>

        <div className="flex flex-col items-center gap-2 justify-center">
          <button className="shadow-lg shadow-red-500/50 shadow-red-200/50 hover:bg-red-500 hover:bg-red-200 ease-in-out duration-500 font-medium rounded-full text-sm px-4 py-3 text-center">
            <FontAwesomeIcon icon={faSignOut} />
          </button>
          <span className="text-gray-200">clock out</span>
        </div>
      </div>

<div className="mt-5">
<AttendanceHistory />
</div>
      
    </div>
  );
}
