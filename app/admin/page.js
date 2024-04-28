"use client";
import {
  faCalendarCheck,
  faClipboardUser,
  faSignOut,
  faUser,
  faUserTie,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import styles from "./layout.module.css";

export default function AdminDashboard() {
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
        <h1 className="font-bold text-xl">Admin Dashboard</h1>
        <div>
          {/* Display the current time */}
          <p>{currentTime}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded p-3 bg-black text-white relative">
            <div className="flex gap-2">
              <span className={`${styles.icons}`}>
                <FontAwesomeIcon
                  icon={faUsers}
                  width={50}
                  height={50}
                  className={`text-4xl text-green-200`}
                />
              </span>

              <h1>Total Employees</h1>
            </div>
            <div>20</div>
          </div>
          <div className="rounded p-3 bg-black text-white relative">
            <div className="flex gap-2">
              <span className={`${styles.icons}`}>
                <FontAwesomeIcon
                  icon={faUserTie}
                  width={50}
                  height={50}
                  className={`text-4xl text-green-200`}
                />
              </span>

              <h1>Admins</h1>
            </div>
            <div>5</div>
          </div>
          <div className="rounded p-3 bg-black text-white relative">
            <div className="flex gap-2">
              <span className={`${styles.icons}`}>
                <FontAwesomeIcon
                  icon={faCalendarCheck}
                  width={50}
                  height={50}
                  className={`text-4xl text-green-200`}
                />
              </span>

              <h1>Today's Appointments</h1>
            </div>
            <div>5</div>
          </div>
          <div className="rounded p-3 bg-black text-white relative">
            <div className="flex gap-2">
              <span className={`${styles.icons}`}>
                <FontAwesomeIcon
                  icon={faClipboardUser}
                  width={50}
                  height={50}
                  className={`text-4xl text-green-200`}
                />
              </span>

              <h1>Today's Attendance</h1>
            </div>
            <div>10</div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <button
          // onClick={() => {
          //   setLogout(true);
          // }}
          className="p-2 rounded-lg bg-red-700 hover:bg-red-600 text-white"
        >
          <FontAwesomeIcon className="mr-2" icon={faSignOut} />
          Logout
        </button>
      </div>
    </div>
  );
}
