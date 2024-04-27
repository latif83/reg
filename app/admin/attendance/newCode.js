"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./newCode.module.css";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const NewCode = ({setCreateCode,setGData}) => {
  const [randomCode, setRandomCode] = useState(null);

  useEffect(() => {
    const generaterandomCode = () => {
      const randomCode = Math.floor(Math.random() * 1000000); // Generates a random number between 0 and 99
      setRandomCode(randomCode);
    };

    generaterandomCode();

    // You can optionally add a cleanup function if necessary
    // return () => {
    //   // Cleanup code here
    // };
  }, []); // empty dependency array means this effect will run only once after the component mounts

  const [sData, setSData] = useState(false);

  const [loading, setLoading] = useState(false);

  const createCode = () => {
    setSData(true);
  };

  useEffect(() => {
    const sendCode = async () => {
      try {
        setLoading(true);

        const data = {
          code: randomCode,
        };

        const response = await fetch("/api/attendance/code", {
          method: "POST",
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          setLoading(false);
          setCreateCode(false)
          return;
        }

        toast.success(responseData.message);
        setLoading(false);
        setGData(true)
        setCreateCode(false)
      } catch (err) {
        console.log(err);
      }
    };

    if (sData) {
      sendCode();
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
          <h1 className="font-semibold">Attendance Code</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setCreateCode(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>

        <div className="text-center">
          <p>Today's Code</p>
          <p className="text-mute text-xl font-bold">{randomCode}</p>

          <button
            disabled={loading}
            onClick={createCode}
            className="mt-5 w-full bg-blue-500 disabled:bg-blue-200 hover:bg-blue-600 text-white font-medium rounded py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />{" "}
                Create
              </>
            ) : (
              "Create"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
