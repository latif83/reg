"use client";
import { useEffect, useState } from "react";
import styles from "./logout.module.css";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export const Logout = ({ setLogout }) => {
  const [confirmLogout, setConfirmLogout] = useState(false);

  const [loading,setLoading] = useState(false)

  const router = useRouter();

  useEffect(() => {
    const Logout = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/logout");
        const responseData = await response.json();

        if (!response.ok) {
          setLoading(false)
          toast.error(responseData.error);
          return;
        }


        toast.success(responseData.message);
        router.push("/");
        setLogout(false)
      } catch (err) {
        console.log(err);
      }
    };

    if (confirmLogout) {
      Logout();
    }
  }, [confirmLogout]);

  return (
    <div className={`${styles.container} flex items-center justify-center`}>
      <div className="w-full max-w-lg mx-auto bg-gray-50 rounded shadow p-6">
        <p>Are you sure you want to log out?</p>

        <div className="mt-3 flex justify-between">
          <button
            onClick={() => setLogout(false)}
            className="bg-red-700 text-white p-2 rounded hover:bg-red-600"
          >
            No
          </button>
          <button
            onClick={() => setConfirmLogout(true)}
            className="bg-green-700 text-white p-2 rounded hover:bg-green-600"
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
};
