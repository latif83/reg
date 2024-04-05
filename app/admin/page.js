"use client"
import { useEffect, useState } from "react";

export default function AdminDashboard (){

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
        </div>
    )
}