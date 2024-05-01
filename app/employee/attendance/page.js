"use client";
import {
  faPause,
  faPlay,
  faSignIn,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { AttendanceHistory } from "./history";
import { PassKey } from "./passKey";
import { QRAuth } from "./qrAuth";
import { toast } from "react-toastify";

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

  const [authenticate, setAuthenticate] = useState(false);
  const [authDone, setAuthDone] = useState(false);
  const [qrAuth, setQRAuth] = useState(false);

  const [fetchData, setFetchData] = useState(true);

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  const [clockInToday, setClockInToday] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);

  const [filters, setFilters] = useState({
    start: "",
    end: "",
  });

  const [breakStart, setBreakStart] = useState(false);
  const [breakEnd, setBreakEnd] = useState(false);
  const [clockOut, setClockOut] = useState(false);

  useEffect(() => {
    const breakStartEnd = async (action) => {
      try {
        const data = {
          action,
        };

        const response = await fetch("/api/attendance/break", {
          method: "POST",
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        toast.success(responseData.message);
        setFetchData(true);
      } catch (err) {
        console.log(err);
        toast.error("Unexpected Error!");
      }
    };

    const clockOutEmployee = async (action) => {
      try {
        const data = {
          action,
        };

        const response = await fetch("/api/attendance/out", {
          method: "POST",
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        toast.success(responseData.message);
        setFetchData(true);
      } catch (err) {
        console.log(err);
        toast.error("Unexpected Error!");
      }
    };

    breakStart && breakStartEnd("start");
    breakEnd && breakStartEnd("end");
    clockOut && clockOutEmployee();
  }, [breakStart, breakEnd, clockOut]);

  useEffect(() => {
    const getAttendanceHistory = async () => {
      try {
        setLoading(true);

        // Convert the data to a query string
        const queryString = new URLSearchParams(filters).toString();

        const response = await fetch(`/api/attendance?${queryString}`);
        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        const today = new Date(); // Get today's date
        const formattedToday = today.toISOString().split("T")[0]; // Format today's date to match the format in the data

        // Filter the array to include only entries where clockIn date matches today's date and clockOut is not null
        const filteredData = responseData.attendanceHistory.filter((entry) => {
          const entryDate = new Date(entry.clockIn); // Convert clockIn date to Date object
          const formattedEntryDate = entryDate.toISOString().split("T")[0]; // Format clockIn date

          // Check if clockIn date matches today's date and clockOut is not null
          return (
            formattedEntryDate === formattedToday && entry.clockOut === null
          );
        });

        console.log(filteredData)

        // Filter the array to include only entries where there's a break start without a break end
        const onBreakData = responseData.attendanceHistory.filter((entry) => {
          const entryBreakStart = entry.breakStart
            ? new Date(entry.breakStart)
            : null; // Convert breakStart date to Date object
          const entryBreakEnd = entry.breakEnd
            ? new Date(entry.breakEnd)
            : null; // Convert breakEnd date to Date object

          // Check if there's a break start without a break end
          const onBreak = entryBreakStart && !entryBreakEnd;

          // Return true if there's a break start without a break end
          return onBreak;
        });

        setIsOnBreak(onBreakData.length > 0);

        setClockInToday(filteredData.length > 0);

        setLoading(false);

        setAttendance(responseData.attendanceHistory);
      } catch (err) {
        console.log(err);
        toast.error("An unexpected error happended, Please try again later.");
      }
    };

    if (fetchData) {
      getAttendanceHistory();
      setFetchData(false);
    }
  }, [fetchData]);

  useEffect(() => {
    if (authDone) {
      setQRAuth(true);
    }
  }, [authDone]);

  return (
    <div>
      {authenticate && (
        <PassKey setAuthenticate={setAuthenticate} setAuthDone={setAuthDone} />
      )}
      {authDone && qrAuth && (
        <QRAuth
          setQRAuth={setQRAuth}
          qrAuth={qrAuth}
          setAuthDone={setAuthDone}
          setFetchData={setFetchData}
        />
      )}
      <div className="flex flex-col justify-center items-center mt-3">
        <h1 className="text-4xl">{currentTime}</h1>
        <p>{currentDate}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-5">
        <div className="flex flex-col items-center gap-2 justify-center">
          <button
            onClick={() => setAuthenticate(true)}
            className={`shadow-lg shadow-blue-500/50 ease-in-out duration-500 font-medium rounded-full text-sm px-4 py-3 text-center ${
              clockInToday
                ? "text-gray-200 hover:bg-blue-200"
                : "hover:bg-blue-500"
            }`}
          >
            <FontAwesomeIcon icon={faSignIn} />
          </button>
          <span className={`${clockInToday ? "text-gray-200" : ""}`}>
            Clock in
          </span>
        </div>

        {clockInToday && isOnBreak ? (
          <div
            onClick={() => setBreakEnd(true)}
            className="flex flex-col items-center gap-2 justify-center"
          >
            <button className="shadow-lg shadow-yellow-500/50 shadow-yellow-200/50 hover:bg-yellow-500 ease-in-out duration-500 font-medium rounded-full text-sm px-4 py-3 text-center">
              <FontAwesomeIcon icon={faPlay} />
            </button>
            <span>Resume</span>
          </div>
        ) : clockInToday && !isOnBreak ? (
          <div className="flex flex-col items-center gap-2 justify-center">
            <button
              onClick={() => setBreakStart(true)}
              className="shadow-lg shadow-yellow-500/50 shadow-yellow-200/50 hover:bg-yellow-500 ease-in-out duration-500 font-medium rounded-full text-sm px-4 py-3 text-center"
            >
              <FontAwesomeIcon icon={faPause} />
            </button>
            <span>Break</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 justify-center">
            <button className="shadow-lg shadow-yellow-500/50 shadow-yellow-200/50 hover:bg-yellow-200 ease-in-out duration-500 font-medium rounded-full text-sm px-4 py-3 text-center text-gray-200">
              <FontAwesomeIcon icon={faPause} />
            </button>
            <span className="text-gray-200">Break</span>
          </div>
        )}

        <div className="flex flex-col items-center gap-2 justify-center">
          <button
            onClick={() => setClockOut(true)}
            className={`shadow-lg shadow-red-500/50 shadow-red-200/50 ease-in-out duration-500 font-medium rounded-full text-sm px-4 py-3 text-center ${
              clockInToday
                ? "hover:bg-red-500"
                : "text-gray-200 hover:bg-red-200"
            }`}
          >
            <FontAwesomeIcon icon={faSignOut} />
          </button>
          <span className={`${clockInToday ? "" : "text-gray-200"}`}>
            clock out
          </span>
        </div>
      </div>

      <div className="mt-5">
        <AttendanceHistory
          loading={loading}
          attendance={attendance}
          filters={filters}
          setFilters={setFilters}
          setFetchData={setFetchData}
        />
      </div>
    </div>
  );
}
