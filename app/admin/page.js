"use client";
import {
  faCalendarCheck,
  faClipboardUser,
  faSignOut,
  faSpinner,
  faUser,
  faUserTie,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import styles from "./layout.module.css";
import { Logout } from "@/components/logout";
import Link from "next/link";

export default function AdminDashboard() {
  // State to hold the current time
  const [currentTime, setCurrentTime] = useState("");

  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({});

  const [logout, setLogout] = useState(false);

  // Function to update the current time
  const updateTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    setCurrentTime(formattedTime);
  };

  // useEffect hook to update the time initially and start the interval
  useEffect(() => {
    const getSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/summary`);
        const responseData = await response.json();
        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        setSummary(responseData.summary);

        setLoading(false);
      } catch (err) {
        console.log(err);
        toast.error("Error retrieving data, please try again later!");
      }
    };

    getSummary();

    updateTime(); // Update the time initially
    // Set up interval to update time every second (1000ms)
    const interval = setInterval(updateTime, 1000);
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {logout && <Logout setLogout={setLogout} />}
      <div className="border-b pb-3 flex sm:flex-row flex-col justify-between items-center">
        <h1 className="font-bold text-xl">Admin Dashboard</h1>
        <div>
          {/* Display the current time */}
          <p>{currentTime}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="grid sm:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4">
          <Link
            href={"/admin/employees"}
            className="rounded p-3 bg-black text-white relative cursor-pointer hover:bg-gray-700"
          >
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
            <div>
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                summary.employeeCount
              )}
            </div>
          </Link>
          <Link
            href={"/admin/admins"}
            className="rounded p-3 bg-black text-white relative cursor-pointer hover:bg-gray-700"
          >
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
            <div>
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                summary.adminCount
              )}
            </div>
          </Link>
          <Link
            href={"/admin/appointments"}
            className="rounded p-3 bg-black text-white relative cursor-pointer hover:bg-gray-700"
          >
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
            <div>
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                summary.appointmentCount
              )}
            </div>
          </Link>
          <Link
            href={"/admin/attendance"}
            className="rounded p-3 bg-black text-white relative cursor-pointer hover:bg-gray-700"
          >
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
            <div>
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                summary.attendanceCount
              )}
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={() => {
            setLogout(true);
          }}
          className="p-2 rounded-lg bg-red-700 hover:bg-red-600 text-white"
        >
          <FontAwesomeIcon className="mr-2" icon={faSignOut} />
          Logout
        </button>
      </div>
    </div>
  );
}
