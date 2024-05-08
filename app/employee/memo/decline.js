"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./nMemo.module.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { toast } from "react-toastify";

export const DeclineRequest = ({
  setDeclineRequest,
  setConfirmDecline,
  declineReason,
  setDeclineReason,
}) => {
  const [typeReason, setTypeReason] = useState(false);

  return (
    <div className={`${styles.container} flex items-center justify-center`}>
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6">
        <div className="flex justify-between mb-5">
          <h1 className="font-semibold">Decline Memo</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setDeclineRequest(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>

        {typeReason ? (
          <div className="mt-5">
            <div className="relative z-0 w-full group mb-5">
              <textarea
                name="purpose"
                id="purpose"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              ></textarea>
              <label
                htmlFor="purpose"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                State reasons for declining this memo.
              </label>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (!declineReason) {
                    toast.error(
                      "Please state a reason for declining this request!"
                    );
                    return;
                  }

                  setConfirmDecline(true);
                  setDeclineRequest(false);
                }}
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl p-3"
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1>Are your sure you want to decline this memo?</h1>

            <div className="mt-5 flex justify-between">
              <button
                onClick={() => setDeclineRequest(false)}
                className="p-3 bg-red-600 text-white hover:bg-red-700 rounded-xl"
              >
                No
              </button>
              <button
                onClick={() => {
                  setTypeReason(true);
                }}
                className="p-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl"
              >
                Yes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
