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

export const PassKey = ({ setAuthenticate }) => {
  const [loading, setLoading] = useState(false);

  const [usePassword, setUsePassword] = useState(false);
  const [useFingerprint, setUseFingerprint] = useState(false);

  const [pickAuthChoice, setPickAuthChoice] = useState(true);

  useEffect(() => {
    const fingerPrintAuth = async () => {
      const rawIdArrayBuffer = "Array buffer here...";

      const assertionOptions = {
        publicKey: {
          rpId: "localhost",
          challenge: new Uint8Array(32),
          userVerification: "preferred",
          allowCredentials: [{ type: "public-key", id: rawIdArrayBuffer }],
        },
      };

      // Perform assertion
      const assertion = await navigator.credentials.get(assertionOptions);

      console.log(assertion);
    };

    if (useFingerprint) {
      fingerPrintAuth();
    }
  }, [useFingerprint]);

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
                Authenticate with fingerprint
              </p>
            </div>
          </div>
        )}

        {usePassword && (
          <form>
            <div className="relative z-0 w-full group">
              <input
                type="password"
                name="password"
                id="password"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
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
