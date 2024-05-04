"use client";
import Link from "next/link";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";

export const EmployeeSidebar = ({ setShowSidebar }) => {
  const pathname = usePathname();

  const toggleSidebar = () => {
    const width = window.innerWidth;
    if (width < 965) {
      setShowSidebar(false);
    }
  };

  return (
    <div className="bg-blue-700 relative border-2 h-full w-full p-2">
      <div className="flex w-full overflow-hidden items-center flex-col justify-center mt-3 font-semibold text-gray-700 gap-2">
        <img
          class="w-10 h-10 mr-2 p-2 bg-white rounded-full"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
          alt="logo"
        />
        <span className={`${styles.marquee} text-gray-200`}>
          Employee Attendance & Appointment Management System
        </span>
      </div>

      <div className="mt-12 flex flex-col gap-4">
        <Link
          className={`p-2 rounded-lg hover:font-semibold ${
            pathname == "/employee" && "bg-gray-200"
          }`}
          href="/employee"
          onClick={toggleSidebar}
        >
          Dashboard
        </Link>
        <Link
          className={`p-2 rounded-lg hover:font-semibold ${
            pathname.includes("attendance") && "bg-gray-200"
          }`}
          href="/employee/attendance"
          onClick={toggleSidebar}
        >
          Attendance
        </Link>
        <Link
          className={`p-2 rounded-lg hover:font-semibold ${
            pathname === "/employee/appointments" && "bg-gray-200"
          }`}
          href="/employee/appointments"
          onClick={toggleSidebar}
        >
          Appointments
        </Link>
        <Link
          className={`p-2 rounded-lg hover:font-semibold ${
            pathname === "/employee/appointment" && "bg-gray-200"
          }`}
          href="/employee/appointment"
          onClick={toggleSidebar}
        >
          Book Appointments
        </Link>
        <Link
          className={`p-2 rounded-lg hover:font-semibold ${
            pathname === "/employee/setfingerprint" && "bg-gray-200"
          }`}
          href="/employee/setfingerprint"
          onClick={toggleSidebar}
        >
          Set Fingerprint
        </Link>
      </div>

      <div className="absolute bottom-0 w-full left-0">
        <button className="bg-gray-800 w-full flex justify-center items-center gap-2 text-white p-2 hover:bg-gray-600">
          <FontAwesomeIcon icon={faSignOut} />
          Log out
        </button>
      </div>
    </div>
  );
};
