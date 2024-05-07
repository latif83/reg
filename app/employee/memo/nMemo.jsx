"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./nMemo.module.css";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const NewMemo = ({ setNMemo, setGData }) => {

  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoad] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [deptId, setDeptId] = useState("");
  const [empId, setEmpId] = useState("");

  const [getEmp, setGetEmp] = useState(false);

  const [loading, setLoading] = useState(false);

  const [sendData,setSendData] = useState(false)

  const submit = () => {
    setSendData(true)
  };

  useEffect(() => {
    
    const getDepartments = async () => {
      try {
        setDeptLoad(true);
        const response = await fetch("/api/dept");
        const responseData = await response.json();
        if (!response.ok) {
          toast.error(responseData.error);
          // setLoading(false)
          return;
        }
        // console.log(responseData.departments);
        setDepartments(responseData.departments);
        setDeptLoad(false);
        // toast.success(responseData.message)
      } catch (err) {
        console.log(err);
        toast.error("Departments data could not be retrieved!");
      }
    };

    const getEmployees = async () => {
      try {
        setEmpLoading(true);
        const response = await fetch(`/api/dept/${deptId}/employees`);
        const responseData = await response.json();
        if (!response.ok) {
          toast.error(responseData.error);
          // setLoading(false)
          return;
        }

        setEmployees(responseData.employees);
        setEmpLoading(false);
        // toast.success(responseData.message)
      } catch (err) {
        console.log(err);
        toast.error("Employees data could not be retrieved!");
      }
    };

    const sendMemo = async () => {
      try {
        setLoading(true);

        const data = {
          title,
          details,
          recipientId : empId,
        };

        const response = await fetch(`/api/memo`,{
          method : "POST",
          body : JSON.stringify(data)
        });

        const responseData = await response.json();
        if (!response.ok) {
          toast.error(responseData.error);
          setLoading(false)
          return;
        }

        toast.success(responseData.message)
        setLoading(false);
        setNMemo(false)
        setGData(true)
        
      } catch (err) {
        console.log(err);
        toast.error("Employees data could not be retrieved!");
      }
    };

    getDepartments();

    if (getEmp) {
      getEmployees();
      setGetEmp(false);
    }

    if(sendData){
      sendMemo()
      setSendData(false)
    }

  }, [getEmp,sendData]);

  const getEmployees = () => {
    setGetEmp(true);
  };

  return (
    <div className={`${styles.container} pt-12`}>
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded-t shadow p-6 h-full">
        <div className="flex justify-between mb-5">
          <h1 className="font-semibold">New Memo</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setNMemo(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>
        <form action={submit}>
          <div className="relative z-0 w-full group mb-5">
            <input
              type="text"
              name="title"
              id="title"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label
              htmlFor="title"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Title{" "}
              <span className="text-xs"> ( e.g Purchase Requisition ) </span>
            </label>
          </div>

          <div className="relative z-0 w-full group mb-5">
            <textarea
              name="details"
              id="details"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            ></textarea>
            <label
              htmlFor="details"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Memo Description
            </label>
          </div>

          <p className="mb-5 text-lg rounded bg-gray-600 text-white p-2">
            Memo Reciepient:
          </p>

          <div className="relative z-0 w-full group mb-5">
            <label
              htmlFor="dept"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Department
            </label>
            <select
              id="dept"
              name="dept"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              value={deptId}
              onChange={(e) => {
                setDeptId(e.target.value);
                getEmployees();
              }}
            >
              <option value="">Select Department</option>
              {deptLoading ? (
                <option>
                  {" "}
                  <FontAwesomeIcon
                    icon={faSpinner}
                    color="red"
                    className="text-lg"
                    spin
                  />{" "}
                  Loading Departments...{" "}
                </option>
              ) : departments.length > 0 ? (
                departments.map((dept) => (
                  <option value={dept.id}>{dept.name}</option>
                ))
              ) : (
                <option>No departments found.</option>
              )}
            </select>
          </div>

          <div className="relative z-0 w-full group mb-5">
            <label
              htmlFor="dept"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Employee
            </label>
            <select
              id="dept"
              name="dept"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
            >
              <option value="">Select Employee</option>
              {empLoading ? (
                <option>
                  {" "}
                  <FontAwesomeIcon
                    icon={faSpinner}
                    color="red"
                    className="text-lg"
                    spin
                  />{" "}
                  Loading Employees...{" "}
                </option>
              ) : employees.length > 0 ? (
                employees.map((employee) => (
                  <option value={employee.id}>
                    {employee.fname} {employee.lname}
                  </option>
                ))
              ) : (
                <option>No employees found.</option>
              )}
            </select>
          </div>

          <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 disabled:bg-blue-200 hover:bg-blue-600 text-white font-medium rounded py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Submit{" "}
              </>
            ) : (
              "Submit"
            )}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};
