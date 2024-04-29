"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EmployeeSidebar } from "./sidebar";
import { faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import styles from "./layout.module.css";

export default function RootLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar((state) => !state);
  };

  useEffect(() => {
    const width = window.innerWidth;

    if (width < 965) {
      setShowSidebar(false);
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        style={{ width: "20%" }}
        className={`h-full ${!showSidebar && "hidden"} ${
          styles.sidebarContainer
        }`}
      >
        <EmployeeSidebar setShowSidebar={setShowSidebar} />
      </div>
      <div
        style={{ width: "100%", height: "100%" }}
        className={`h-full border-2 ${styles.mainContainer} flex flex-col`}
      >
        <div
          style={{ height: "10%" }}
          className="bg-blue-700 shadow p-3 flex justify-between items-center text-gray-100"
        >
          <div>
            <FontAwesomeIcon
              onClick={toggleSidebar}
              icon={faBarsStaggered}
              className="text-lg cursor-pointer text-gray-100 hover:text-gray-300"
              width={20}
              height={20}
            />
          </div>
          <div>
            <h1>Good Morning,</h1>
            <p>Abdul-Latif Mohammed</p>
          </div>
        </div>
        <div style={{ height: "90%" }} className="p-3 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
