"use client";
import Link from "next/link";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";

export const AdminSidebar = ({ setShowSidebar }) => {
  const pathname = usePathname();

  const toggleSidebar = () => {
    const width = window.innerWidth;
    if (width < 965) {
      setShowSidebar(false);
    }
  };

  return (
    <div className="bg-blue-700 border-2 h-full w-full p-2">
      <div className="flex w-full overflow-hidden items-center flex-col justify-center mt-3 font-semibold text-gray-700 gap-2">
        <img
          class="w-10 h-10 mr-2 p-2 bg-white rounded-full"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
          alt="logo"
        />
        <span className={`${styles.marqueee} text-gray-200`}>
          SCHEDULE SYNC
        </span>
      </div>

      <div className="mt-12 flex flex-col gap-3">
        <Link
          className={`p-2 rounded-lg hover:font-semibold ${
            pathname == "/admin" && "bg-gray-200"
          }`}
          href="/admin"
          onClick={toggleSidebar}
        >
          Dashboard
        </Link>
        <Link
          className={`p-2 rounded-lg hover:font-semibold ${
            pathname.includes("attendance") && "bg-gray-200"
          }`}
          href="/admin/attendance"
          onClick={toggleSidebar}
        >
          Attendance
        </Link>
        <Link
          className={`p-2 rounded-lg hover:font-semibold ${
            pathname.includes("/admin/employees") && "bg-gray-200"
          }`}
          href="/admin/employees"
          onClick={toggleSidebar}
        >
          Employees
        </Link>
        <Link
          className={`p-2 rounded-lg hover:font-semibold ${
            pathname.includes("/admin/departments") && "bg-gray-200"
          }`}
          href="/admin/departments"
          onClick={toggleSidebar}
        >
          Departments
        </Link>
        <Link
          className={`p-2 rounded-lg hover:font-semibold ${
            pathname.includes("/admin/admins") && "bg-gray-200"
          }`}
          href="/admin/admins"
          onClick={toggleSidebar}
        >
          Admins
        </Link>

        <Link
          className={`p-2 rounded-lg hover:font-semibold ${
            pathname.includes("/admin/appointments") && "bg-gray-200"
          }`}
          href="/admin/appointments"
          onClick={toggleSidebar}
        >
          Appointments
        </Link>
      </div>
    </div>
  );
};
