"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./nEmployee.module.css";
import { faD, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const NEmployee = ({ setAddEmployee, setGData }) => {
  const [loading, setLoading] = useState(false);

  const [fData, setFData] = useState(null);
  const [sData, setSData] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoad] = useState(false);

  const submit = (data) => {
    setFData(data);
    setSData(true);
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

    getDepartments();
  }, []);

  useEffect(() => {
    const addEmployee = async () => {
      try {
        setLoading(true);

        const data = {
          fname: fData.get("fname"),
          lname: fData.get("lname"),
          email: fData.get("email"),
          address: fData.get("address"),
          contact: fData.get("contact"),
          staffid: fData.get("staffid"),
          deptId: fData.get("dept"),
        };

        const response = await fetch("/api/employee", {
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
        setGData(true)
        setAddEmployee(false);
      } catch (err) {
        console.log(err);
        toast.error("Data not sent, try again later!");
      }
    };

    if (sData) {
      addEmployee();
      setSData(false);
    }
  }, [sData]);

  return (
    <div className={`${styles.container} flex items-center justify-center`}>
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6">
        <div className="flex justify-between mb-5">
          <h1 className="font-semibold">Add Employee</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setAddEmployee(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>
        <form action={submit}>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div className="relative z-0 w-full group">
              <input
                type="text"
                name="fname"
                id="fname"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="fname"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                First Name
              </label>
            </div>
            <div className="relative z-0 w-full group">
              <input
                type="text"
                name="lname"
                id="lname"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="lname"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Last Name
              </label>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div className="relative z-0 w-full group">
              <input
                type="email"
                name="email"
                id="email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email
              </label>
            </div>
            <div className="relative z-0 w-full group">
              <input
                type="text"
                name="contact"
                id="contact"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="contact"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Phone Number
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div className="relative z-0 w-full group">
              <input
                type="text"
                name="staffid"
                id="staffid"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="staffid"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Staff Id
              </label>
            </div>
            <div className="relative z-0 w-full group">
              <input
                type="text"
                name="address"
                id="address"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="address"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Address
              </label>
            </div>
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 disabled:bg-blue-200 hover:bg-blue-600 text-white font-medium rounded py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Add
                Employee{" "}
              </>
            ) : (
              "Add Employee"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
