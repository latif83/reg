"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import styles from "./nDept.module.css";
import { toast } from "react-toastify";

export const NDept = ({ setAddDept,setGData }) => {
  const [loading, setLoading] = useState(false);

  const [deptName, setDeptName] = useState("");
  const [sData, setSData] = useState(false);
  const submit = () => {
    setSData(true);
  };

  useEffect(() => {
    const addDepartment = async () => {
      try {
        setLoading(true);
        const data = {
          deptName,
        };

        const response = await fetch("/api/dept", {
          method: "POST",
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          setLoading(false);
          return;
        }

        toast.success(responseData.message);

        setAddDept(false);
        setGData(true)
      } catch (err) {
        console.log(err);
        toast.error("Data not sent, try again later!");
      }
    };

    if (sData) {
      addDepartment();
      setSData(false);
    }
  }, [sData]);

  return (
    <div className={`${styles.container} flex pt-12 justify-center`}>
      <div
        className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6"
        style={{ flexGrow: 0, height: "max-content" }}
      >
        <div className="flex justify-between mb-5">
          <h1 className="font-semibold">Add Department</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setAddDept(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>
        <form action={submit}>
          <div className="relative z-0 w-full group mb-5">
            <input
              type="text"
              name="deptName"
              id="deptName"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              required
            />
            <label
              htmlFor="deptName"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Department Name
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 disabled:bg-blue-200 hover:bg-blue-600 text-white font-medium rounded py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Add
                Department{" "}
              </>
            ) : (
              "Add Department"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
