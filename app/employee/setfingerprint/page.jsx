"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function SetFingerprint() {
  const [hasFingerprint, setHasFingerprint] = useState(false);

  const [employeeInfo, setEmployeeInfo] = useState({})

  useEffect(() => {

    const getEmployeeInfo = async () => {
      try {
        const empId = "unkwown";
        const response = await fetch(`/api/employee/${empId}`);
        const responseData = await response.json();
        if (!response.ok) {
          toast.error(responseData.error);

          return;
        }

        setEmployeeInfo(responseData.employee);

        console.log(responseData.employee);

      } catch (err) {
        console.log(err);
        toast.error("Error retrieving data, please try again later!");
      }
    };

    getEmployeeInfo()

  }, []);

  useEffect(()=>{
    // Check if the fingerprint flag is stored in localStorage
    const fingerprintFlag = localStorage.getItem(employeeInfo.id);
    if (fingerprintFlag) {
      setHasFingerprint(true);
    } 
  },[employeeInfo])

  const setFingerprint = () => {
    try {
      // Generate a random challenge (this should be generated by your server)
      const challenge = new Uint8Array(32); // Replace with actual challenge
      window.crypto.getRandomValues(challenge);

      const options = {
        publicKey: {
          rp: {
            id: process.env.NGROK,
            name: "Schedule Sync",
          },
          user: {
            id: new TextEncoder().encode("1").buffer, // Replace with actual user ID
            name: "admin@schedulesync.com",
            displayName: "Schedule Sync",
          },
          challenge: challenge,
          pubKeyCredParams: [{ type: "public-key", alg: -7 }],
          authenticatorSelection: {
            authenticatorAttachment: "platform", // or "cross-platform" depending on your needs
            userVerification: "required", // Required for fingerprint authentication
            requireResidentKey: true, // Ensures that the authenticator supports storing credentials locally
          },
          // Additional options can be added as needed
        },
      };

      // Create a new credential
      navigator.credentials.create(options).then((credential) => {
        // Convert ArrayBuffer (rawId) to base64-encoded string
        const rawIdBase64 = btoa(
          String.fromCharCode.apply(null, new Uint8Array(credential.rawId))
        );

        const clientDataJSONBase64 = new TextDecoder().decode(
          credential.response.clientDataJSON
        );

        const attestationObjectBase64 = new TextDecoder().decode(
          credential.response.attestationObject
        );

        // Prepare the extracted data to send to the backend
        const extractedData = {
          id: credential.id,
          rawId: rawIdBase64, // Use the base64-encoded rawId
          response: {
            clientDataJSON: clientDataJSONBase64, // Use the base64-encoded clientDataJSON
            attestationObject: attestationObjectBase64, // Use the base64-encoded attestationObject
          },
          type: credential.type,
        };

        // Display extracted data for debugging
        // console.log("Extracted Data:", extractedData);

        // console.log(credential);

        // Store the fingerprint flag in localStorage
        localStorage.setItem("hasFingerprint", "true");
        localStorage.setItem(employeeInfo.id, JSON.stringify(extractedData));

        setHasFingerprint(true);
        toast.success("Fingerprint has being setted successfully!");
      });
    } catch (err) {
      console.log(err);
      toast.error(
        "There was an error setting up fingerprint, please try again!"
      );
    }
  };

  return (
    <div>
      <h1 className="text-lg">Set Biometric</h1>
      <div className="mt-8">
        {hasFingerprint ? (
          <div>
            <p>You have already set up biometric authentication.</p>
            <button
              className="bg-red-600 text-gray-100 p-2 rounded"
              onClick={() => {
                setHasFingerprint(false)
                localStorage.removeItem(employeeInfo.id)
                toast.error("Fingerprint / Face ID authentication removed successfully!")
              }}
            >
              Remove biometric authentication
            </button>
          </div>
        ) : (
          <button
            className="bg-gray-900 text-gray-100 p-2 rounded"
            onClick={setFingerprint}
          >
            Set up biometric authentication
          </button>
        )}
      </div>
    </div>
  );
}
