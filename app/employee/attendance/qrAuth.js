"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./passKey.module.css";
import {
  faQrcode,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { faKeyboard } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";
import { Scanner } from '@yudiel/react-qr-scanner';

export const QRAuth = ({ setQRAuth, qrAuth, setAuthDone, setFetchData }) => {
  const [pickQRChoice, setPickQRChoice] = useState(true);

  const [enterAttendanceCode, setEnterAttendanceCode] = useState(false);

  const [attendanceCode, setAttendanceCode] = useState("");

  const [loading, setLoading] = useState(false);

  const [read, setRead] = useState(true);

  const hideQRModal = () => {
    setAuthDone(false);
    setQRAuth(false);
  };

  const [sData, setSData] = useState(false);

  const [useFingerPrint, setUseFingerprint] = useState(false);

  const submit = () => {
    setSData(true);
  };

  useEffect(() => {
    const sendAttendance = async () => {
      try {
        setLoading(true);

        const data = {
          attendanceCode,
        };

        const response = await fetch("/api/attendance/in", {
          method: "POST",
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
          setLoading(false);
          toast.error(responseData.error);
          return;
        }

        toast.success(responseData.message);

        setFetchData(true);

        hideQRModal();
      } catch (err) {
        console.log(err);
      }
    };

    if (sData) {
      sendAttendance();
      setSData(false);
    }
  }, [sData]);

  const logError = (e)=>{
    console.log(e)
  }

  const QrRead = (e)=>{
    console.log(e)
  }

  return (
    <div className={`${styles.container} flex items-center justify-center`}>
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6">
        <div className="mb-5 flex justify-between items-center">
          <h1 className="text-center">Clock in</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={hideQRModal}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>

        {/* Clock in authenticate method choose method! */}

        {pickQRChoice && (
          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-4 items-center justify-center">
              <button
                onClick={() => {
                  setEnterAttendanceCode(true);
                  setPickQRChoice(false);
                }}
                className="shadow-lg shadow-gray-500/50 hover:bg-gray-700 ease-in-out duration-500 font-medium rounded-full text-3xl px-3 py-3 text-center hover:text-white"
              >
                <FontAwesomeIcon icon={faKeyboard} />
              </button>
              <p className="text-xs font-semibold text-center">
                Enter Attendance Code <br />{" "}
                <small className="text-red-500" style={{ fontStyle: "italic" }}>
                  {" "}
                  See Admin for code{" "}
                </small>{" "}
              </p>
            </div>

            <div className="flex flex-col gap-4 items-center justify-center">
              <button
                onClick={() => {
                  setUseFingerprint(true);
                  setPickQRChoice(false);
                }}
                className="shadow-lg shadow-gray-500/50 hover:bg-gray-700 ease-in-out duration-500 font-medium rounded-full text-3xl px-4 py-3 text-center hover:text-white"
              >
                <FontAwesomeIcon icon={faQrcode} />
              </button>
              <p className="text-xs font-semibold">Scan QR Code</p>
            </div>
          </div>
        )}

        {enterAttendanceCode && (
          <form action={submit}>
            <div className="relative z-0 w-full group">
              <input
                type="attendanceCode"
                name="attendanceCode"
                id="attendanceCode"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={attendanceCode}
                onChange={(e) => setAttendanceCode(e.target.value)}
              />
              <label
                htmlFor="attendanceCode"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Enter Attendance Code
              </label>
            </div>
            <p>
              <small
                className="text-red-500 text-xs font-semibold"
                style={{ fontStyle: "italic" }}
              >
                See Admin for Code
              </small>
            </p>

            <div className="flex justify-end mt-5">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 disabled:bg-blue-200 hover:bg-blue-600 text-white font-medium rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />{" "}
                    Submit{" "}
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        )}

        {useFingerPrint && (
          // <QrReader read={read} onRead={(e)=>QrRead(e)} onReadError={(e)=>logError(e)}>
          //   <QrReaderViewFinder />
          // </QrReader>
          <Scanner
            onResult={(text, result) => console.log(text, result)}
            onError={(error) => console.log(error?.message)}
        />
        )}
      </div>
    </div>
  );
};
