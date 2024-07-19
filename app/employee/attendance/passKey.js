"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./passKey.module.css";
import {
  faFingerprint,
  faLock,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const PassKey = ({ setAuthenticate, setAuthDone }) => {
  const [loading, setLoading] = useState(false);

  const [usePassword, setUsePassword] = useState(false);
  const [useFingerprint, setUseFingerprint] = useState(false);

  const [pickAuthChoice, setPickAuthChoice] = useState(true);

  const [enteredPassword, setEnteredPassword] = useState("");

  useEffect(() => {
    const fingerPrintAuth = async () => {
     try{

       // Check if the fingerprint flag is stored in localStorage
    const fingerprintFlag = localStorage.getItem("hasFingerprint");
    let fingerprintData = {}
    if (fingerprintFlag === "true") {
      fingerprintData = JSON.parse(localStorage.getItem("Fingerprint"))
    }

      const registrationData = {
        rawId: "nUAQBIHiMO+W8Q3RZr+4sA==",
      };

      // Decode rawId from base64 to ArrayBuffer
      const rawIdArrayBuffer = Uint8Array.from(
        atob(fingerprintData.rawId),
        (c) => c.charCodeAt(0)
      );
      const challenge = new Uint8Array(32);

      // Construct assertion options

      const assertionOptions = {
        publicKey: {
          rpId: process.env.NGROK,
          challenge: new Uint8Array(32),
          userVerification: "preferred",
          allowCredentials: [
            { type: "public-key", id: rawIdArrayBuffer.buffer },
          ],
        },
      };

      // Perform assertion
      navigator.credentials
        .get(assertionOptions)
        .then((assertion) => {
          // Handle assertion response
          console.log("Assertion response:", assertion);
          // const verificationStatus = document.getElementById("verificationStatus");
          toast.success("Verification successful");
          setAuthDone(true);
          setAuthenticate(false);
        })
        .catch((error) => {
          console.error("Assertion failed:", error);
          // const verificationStatus = document.getElementById("verificationStatus");
          // verificationStatus.innerText = "Verification failed";
          // Handle assertion failure, e.g., display an error message to the user
          toast.error("Verification failed");
        });
     } catch(err){
      console.log(err)
      toast.error("Fingerprint authentication failed on this device, please try again with a different device!")
     }
    };

    if (useFingerprint) {
      fingerPrintAuth();
    }
  }, [useFingerprint]);

  const [sData, setSData] = useState(false);

  const submit = () => {
    setSData(true);
  };

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        setLoading(true);

        const data = {
          password: enteredPassword,
        };

        const response = await fetch("/api/login/authwithpassword", {
          method: "POST",
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        setLoading(false);

        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        toast.success(responseData.message);
        setAuthDone(true);
        setAuthenticate(false);
      } catch (err) {
        console.log(err);
        toast.error("Unexpected Error, Please try again later!");
      }
    };

    if (sData) {
      authenticateUser();
      setSData(false);
    }
  }, [sData]);

  return (
    <div className={`${styles.container} flex items-center justify-center`}>
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6">
        <div className="mb-5 flex justify-between items-center">
          <h1 className="text-center">Clock in</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setAuthenticate(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>

        {/* Clock in authenticate method choose method! */}

        {pickAuthChoice && (
          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-4 items-center justify-center">
              <button
                onClick={() => {
                  setUsePassword(true);
                  setPickAuthChoice(false);
                }}
                className="shadow-lg shadow-lime-500/50 hover:bg-lime-500 ease-in-out duration-500 font-medium rounded-full text-3xl px-4 py-3 text-center hover:text-white"
              >
                <FontAwesomeIcon icon={faLock} />
              </button>
              <p className="text-xs font-semibold">Enter Password</p>
            </div>

            <div className="flex flex-col gap-4 items-center justify-center">
              <button
                onClick={() => {
                  setUseFingerprint(true);
                  setPickAuthChoice(false);
                }}
                className="shadow-lg shadow-lime-500/50 hover:bg-lime-500 ease-in-out duration-500 font-medium rounded-full text-3xl px-4 py-3 text-center hover:text-white"
              >
                <FontAwesomeIcon icon={faFingerprint} />
              </button>
              <p className="text-xs font-semibold">
                Biometric Authentication
              </p>
            </div>
          </div>
        )}

        {usePassword && (
          <form action={submit}>
            <div className="relative z-0 w-full group">
              <input
                type="password"
                name="password"
                id="password"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
              />
              <label
                htmlFor="password"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Enter your password
              </label>
            </div>

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
      </div>
    </div>
  );
};
