"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./details.module.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DeclineRequest } from "./decline";

export const AppointmentDetails = ({ setViewAppointment, appointmentData,setGData }) => {

    const [approveRequest,setApproveRequest] = useState(false)
    const [declineRequest,setDeclineRequest] = useState(false)

    const [confirmDecline,setConfirmDecline] = useState(false)
    const [declineReason,setDeclineReason] = useState("")

    useEffect(()=>{

        const ApproveOrDeclineRequest = async (status)=>{
            try{

                const data = {
                    appointmentId : appointmentData.id,
                    status,
                    declineReason
                }

                const response = await fetch("/api/appointments",{
                    method : "PUT",
                    body : JSON.stringify(data)
                })

                const responseData = await response.json()

                if(!response.ok){
                    toast.error(responseData.error)
                    return
                }

                toast.success(responseData.message)
                setViewAppointment(false)
                setGData(true)

            }
            catch(err){
                console.log(err)
            }
        }

        approveRequest && ApproveOrDeclineRequest("APPROVED")
        confirmDecline && ApproveOrDeclineRequest("DECLINED")

    },[approveRequest,declineRequest])

  return (
    <div className={`${styles.container} flex items-center justify-center`}>
      {declineRequest && <DeclineRequest setDeclineRequest={setDeclineRequest} setConfirmDecline={setConfirmDecline} declineReason={declineReason} setDeclineReason={setDeclineReason} /> }
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6">
        <div className="flex justify-between mb-5">
          <h1 className="font-semibold">Appointment Details</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setViewAppointment(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>

        <div className="grid sm:grid-cols-3 grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-xs text-red-500">
              Visitor's Name:{" "}
            </h3>
            <p>{appointmentData.visitorName}</p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Email: </h3>
            <p>{appointmentData.visitorEmail}</p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Phone: </h3>
            <p>{appointmentData.visitorPhone}</p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">From: </h3>
            <p>{appointmentData.visitorFrom}</p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Date: </h3>
            <p>
              {new Date(appointmentData.appointmentDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Time: </h3>
            <p>
              {new Date(appointmentData.appointmentDate).toLocaleTimeString()}
            </p>
          </div>

          <div className="col-span-3">
            <h3 className="font-semibold text-xs text-red-500">Purpose: </h3>
            <p>{appointmentData.purpose}</p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-4">
          <button onClick={()=>setDeclineRequest(true)} className="bg-red-700 text-sm hover:bg-red-800 text-white p-2 rounded">
            Cancel Request
          </button>
          <button onClick={()=>setApproveRequest(true)} className="bg-green-700 text-sm hover:bg-green-800 text-white p-2 rounded">
            Approve Request
          </button>
        </div>
      </div>
    </div>
  );
};
