"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./share.module.css";
import { faCopy, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const ShareApointment = ({ setShareLink }) => {
  const [url, setURL] = useState("");
  const [copy, setCopy] = useState(false);

  const [employeeInfo, setEmployeeInfo] = useState({});
  const [empLoading, setEmpLoading] = useState(false);

  useEffect(() => {
    const getEmployeeInfo = async () => {
      try {
        setEmpLoading(true);
        const empId = "unkwown";
        const response = await fetch(`/api/employee/${empId}`);
        const responseData = await response.json();
        if (!response.ok) {
          toast.error(responseData.error);

          if (responseData?.redirect) {
            router.push("/");
          }

          return;
        }

        setEmployeeInfo(responseData.employee);

        setURL(`${window.location.origin}/book/${responseData.employee.id}`);

        // console.log(responseData.employee);

        setEmpLoading(false);
      } catch (err) {
        console.log(err);
        toast.error("Error retrieving data, please try again later!");
      }
    };

    getEmployeeInfo();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link Copied!")
  };

  return (
    <div className={`${styles.container} flex items-center justify-center`}>
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6">
        <div className="flex justify-between mb-5">
          <h1 className="font-semibold">Share</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setShareLink(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>
        <h1 className="font-bold text-lg">Appointment Link</h1>
        <p>{empLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : url}</p>
        <div className="mt-2">
          <button
            className="rounded bg-black text-white p-3"
            onClick={copyToClipboard}
          >
            <FontAwesomeIcon icon={faCopy} className="mr-2" />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};
