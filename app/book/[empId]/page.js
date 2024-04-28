// Import necessary dependencies
"use client";
import { faArrowRightLong, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AppointmentSuccess from "./success";

// Define the Appointment component
export default function BookAppointment({ params }) {
  const empId = params.empId;

  const [loading, setLoading] = useState(false);

  const [sData, setSData] = useState(false);

  const [formData, setFormData] = useState(null);

  // Function to handle form submission
  const handleSubmit = (fData) => {
    setFormData(fData);
    setSData(true);
  };

  useEffect(() => {
    const bookApointment = async () => {
      try {
        setLoading(true);

        const data = {
          visitorName: formData.get("visitorName"),
          visitorEmail: formData.get("visitorEmail"),
          visitorPhone: formData.get("visitorPhone"),
          visitorFrom: formData.get("visitorFrom"),
          appointmentDate: formData.get("appointmentDate"),
          purpose: formData.get("purpose"),
        };

        // console.log(data);

        const response = await fetch(`/api/appointments/book/${empId}`, {
          method: "POST",
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        toast.success(responseData.message);
        setLoading(false);
        setBook(false)
      } catch (err) {
        console.log(err);
        toast.error("An unexpected error happened, please try again later!");
      }
    };

    if (sData) {
      bookApointment();
      setSData(false);
    }
  }, [sData]);

  const [employeeInfo, setEmployeeInfo] = useState({});
  const [empLoading, setEmpLoading] = useState(false);

  useEffect(() => {
    const getEmployeeInfo = async () => {
      try {
        setEmpLoading(true);

        const response = await fetch(`/api/employee/${empId}/data`);
        const responseData = await response.json();
        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        setEmployeeInfo(responseData.employee);

        // console.log(responseData.employee);

        setEmpLoading(false);
      } catch (err) {
        console.log(err);
        toast.error("Error retrieving data, please try again later!");
      }
    };

    getEmployeeInfo();
  }, []);

  const [book, setBook] = useState(true);

  return (
    <div className="container mx-auto mt-0">
      <div className="bg-blue-700 text-white p-3 flex justify-between items-center rounded-b">
        <h1>Book Appointment</h1>

        <div>
          <h1 className="text-xl font-bold">
            {employeeInfo.fname} {employeeInfo.lname}
          </h1>
          <p>{employeeInfo.department?.name}</p>
        </div>
      </div>
      {book ? (
        <>
          <form className="mt-8 p-3" action={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div className="relative z-0 w-full group">
                <input
                  type="text"
                  name="visitorName"
                  id="name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Visitor's Name
                </label>
              </div>
              <div className="relative z-0 w-full group">
                <input
                  type="email"
                  name="visitorEmail"
                  id="email"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="email"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  email
                </label>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div className="relative z-0 w-full group">
                <input
                  type="number"
                  name="visitorPhone"
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
              <div className="relative z-0 w-full group">
                <input
                  type="text"
                  name="visitorFrom"
                  id="from"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="from"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  From Address
                </label>
              </div>
            </div>
            <div className="relative z-0 w-full group mb-5">
              <textarea
                name="purpose"
                id="purpose"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              ></textarea>
              <label
                htmlFor="purpose"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Purpose
              </label>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div className="relative z-0 w-full group">
                <input
                  type="datetime-local"
                  name="appointmentDate"
                  id="appointmentDate"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="appointmentDate"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Appointment Date & Time
                </label>
              </div>
            </div>

            <div className="mb-4 flex justify-end">
              <button
                disabled={loading}
                className="bg-blue-700 disabled:bg-blue-200 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                type="submit"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />{" "}
                    Book Appointment
                  </>
                ) : (
                  <>
                    Book Appointment
                    <FontAwesomeIcon icon={faArrowRightLong} className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="mt-12">
          <AppointmentSuccess setBook={setBook} />
        </div>
      )}
    </div>
  );
}
