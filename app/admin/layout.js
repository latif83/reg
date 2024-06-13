"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminSidebar, EmployeeSidebar } from "./sidebar";
import { faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import styles from "./layout.module.css";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ResetPassword } from "@/components/resetPassword";

export default function RootLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar((state) => !state);
  };

  const [adminInfo, setAdminInfo] = useState({});
  const router = useRouter();

  const [resetPassword, setResetPassword] = useState(false);

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const width = window.innerWidth;

    const hours = new Date().getHours();

    if (hours >= 0 && hours < 12) {
      setGreeting("Good Morning");
    } else if (hours >= 12 && hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    const getAdminInfo = async () => {
      try {
        const response = await fetch(`/api/admins/admin`);
        const responseData = await response.json();
        if (!response.ok) {
          toast.error(responseData.error);
          if (responseData?.redirect) {
            router.push("/");
          }
          return;
        }

        setAdminInfo(responseData.admin);
        if (responseData.admin.password == "password@123") {
          setResetPassword(true);
        }

        // console.log(responseData.employee);

        // setEmpLoading(false);
      } catch (err) {
        console.log(err);
        toast.error("Error retrieving data, please try again later!");
      }
    };

    getAdminInfo();

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
        <AdminSidebar setShowSidebar={setShowSidebar} />
      </div>
      <div
        style={{ width: "100%" }}
        className={`h-full border-2 ${styles.mainContainer}`}
      >
        <div className="bg-blue-700 shadow p-3 flex justify-between items-center text-gray-100">
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
            <h1>{greeting},</h1>
            <p>{adminInfo?.name}</p>
          </div>
        </div>
        <div className="p-3">
          {/* reset password! */}
          {resetPassword && (
            <ResetPassword setResetPassword={setResetPassword} role={"admin"} />
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
