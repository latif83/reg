"use client";
import { faPlusCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppointmentDetails } from "./details";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Appointments() {
  const [viewAppointment, setViewAppointment] = useState(false);
  const [appointmentData, setAppointmentData] = useState({});

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(false);

  const [gData, setGData] = useState(true);

  const [filterDate, setFilterDate] = useState("");
  const [filterBy, setFilterBy] = useState("createdAt");

  useEffect(() => {
    const getAppointments = async () => {
      try {
        setLoading(true);
        const filters = `?filterDate=${filterDate}&filterBy=${filterBy}`;
        const response = await fetch(`/api/appointments/admin${filters}`);
        const responseData = await response.json();
        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        // toast.success(responseData.message)

        // console.log(responseData.employees)

        setAppointments(responseData.appointments);
        setLoading(false);
      } catch (err) {
        console.log(err);
        toast.error("Error retrieving data, please try again!");
      }
    };

    if (gData) {
      getAppointments();
      setGData(false);
    }
  }, [gData]);

  return (
    <div>
      {viewAppointment && (
        <AppointmentDetails
          setViewAppointment={setViewAppointment}
          appointmentData={appointmentData}
          setGData={setGData}
        />
      )}
      <h1>Appointments</h1>

      <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
        <div class="p-4 bg-gray-800 flex items-center gap-4">
          <div>
            <label htmlFor="date-input" className="sr-only">
              Select Date
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="date"
                id="date-input"
                className="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Select Date"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  setGData(true);
                }}
              />
            </div>
          </div>

          <div className="relative">
            {/* <label
              htmlFor="dept"
              className="block mb-2 text-sm font-medium text-gray-50"
            >
              Filter by:
            </label> */}
            <select
              id="dept"
              name="dept"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              value={filterBy}
              onChange={(e) => {
                setFilterBy(e.target.value);
                setGData(true);
              }}
            >
              <option value="createdAt">Booking Date</option>
              <option value="appointmentDate">Appointment Date</option>
            </select>
          </div>
        </div>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">
                Visitor's Name
              </th>
              <th scope="col" class="px-6 py-3">
                Date
              </th>
              <th scope="col" class="px-6 py-3">
                Time
              </th>
              <th scope="col" class="px-6 py-3">
                Status
              </th>
              <th scope="col" class="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr class="bg-white border-b hover:bg-gray-50">
                <td colSpan={5} class="px-6 py-4 text-center">
                  <FontAwesomeIcon icon={faSpinner} spin /> Loading...
                </td>
              </tr>
            ) : appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr class="bg-white border-b hover:bg-gray-50">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {appointment.visitorName}
                  </th>
                  <td class="px-6 py-4">
                    {new Date(appointment.appointmentDate).toDateString()}
                  </td>
                  <td class="px-6 py-4">
                    {new Date(appointment.appointmentDate).toLocaleTimeString()}
                  </td>
                  <td class="px-6 py-4 text-xs">
                    <span
                      className={`text-xs font-medium text-gray-100 p-2 rounded ${
                        appointment.status == "PENDING"
                          ? "bg-yellow-700"
                          : appointment.status == "APPROVED"
                          ? "bg-green-700"
                          : "bg-red-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      onClick={() => {
                        setViewAppointment(true);
                        setAppointmentData(appointment);
                      }}
                      class="font-medium text-blue-600 hover:underline mr-2 cursor-pointer"
                    >
                      View
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr class="bg-white border-b hover:bg-gray-50">
                <td colSpan={5} class="px-6 py-4 text-center">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
