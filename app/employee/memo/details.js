"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./nMemo.module.css";
import {
  faArrowDownLong,
  faArrowUpLong,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DeclineRequest } from "./decline";

export const MemoDetails = ({ setViewMemo, memoData, setGData }) => {
  const [approveRequest, setApproveRequest] = useState(false);
  const [declineRequest, setDeclineRequest] = useState(false);

  const [confirmDecline, setConfirmDecline] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  useEffect(() => {
    const ApproveOrDeclineRequest = async (status) => {
      try {
        const data = {
          memoId: memoData.id,
          status,
          declineReason,
        };

        const response = await fetch("/api/memo", {
          method: "PUT",
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        toast.success(responseData.message);

        setGData(true);
        setViewMemo(false);
      } catch (err) {
        console.log(err);
      }
    };

    approveRequest && ApproveOrDeclineRequest("APPROVED");
    confirmDecline && ApproveOrDeclineRequest("DECLINED");
  }, [approveRequest, declineRequest]);

  return (
    <div
      className={`${styles.container} flex items-center justify-center pt-12`}
    >
      {declineRequest && (
        <DeclineRequest
          setDeclineRequest={setDeclineRequest}
          setConfirmDecline={setConfirmDecline}
          declineReason={declineReason}
          setDeclineReason={setDeclineReason}
        />
      )}
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded-t shadow p-6 h-full">
        <div className="flex justify-between mb-5">
          <h1 className="font-semibold">Memo</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setViewMemo(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>

        <div className="mb-5">
          <h3 className="font-semibold text-xs text-red-500">Title: </h3>
          <p>{memoData.title}</p>
        </div>

        <div className="mb-5">
          <h3 className="font-semibold text-xs text-red-500">Description: </h3>
          <p>{memoData.details}</p>
        </div>

        <h3 className="font-semibold text-2xs border-b border-black mb-1">
          <span className="bg-black text-white p-1 rounded">Sender :</span>
        </h3>

        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mb-5">
          <div>
            <h3 className="font-semibold text-xs text-red-500">Name: </h3>
            <p>
              {memoData.sender.fname} {memoData.sender.lname}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Department: </h3>
            <p>{memoData.sender.department?.name}</p>
          </div>
        </div>

        <h3 className="font-semibold text-2xs border-b border-black mb-1">
          <span className="bg-black text-white p-1 rounded">Recipient :</span>
        </h3>

        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mb-5">
          <div>
            <h3 className="font-semibold text-xs text-red-500">Name: </h3>
            <p>
              {memoData.recipient.fname} {memoData.recipient.lname}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Department: </h3>
            <p>{memoData.recipient.department.name}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <h3 className="font-semibold text-xs text-red-500">Date: </h3>
            <p>{new Date(memoData.createdAt).toDateString()}</p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Time: </h3>
            <p>{new Date(memoData.createdAt).toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="mt-5 flex justify-between gap-4">
          <div>
            <p
              className={`text-xs font-medium text-gray-100 p-2 rounded ${
                memoData.customTag == "Sent"
                  ? "text-blue-700"
                  : "text-green-700"
              }`}
            >
              {memoData.customTag}{" "}
              <FontAwesomeIcon
                icon={
                  memoData.customTag == "Sent" ? faArrowUpLong : faArrowDownLong
                }
              />
            </p>
          </div>
          {memoData.customTag == "Received" && (
            <div className="flex gap-2">
              <button
                onClick={() => setDeclineRequest(true)}
                className="bg-red-700 text-sm hover:bg-red-800 text-white p-2 rounded"
              >
                Cancel Request
              </button>
              <button
                onClick={() => setApproveRequest(true)}
                className="bg-green-700 text-sm hover:bg-green-800 text-white p-2 rounded"
              >
                Approve Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
