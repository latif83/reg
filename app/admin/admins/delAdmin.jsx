import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./newAdmin.module.css";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const DelAdmin = ({ setDelAdmin, setGData, adminId }) => {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const deleteAdmin = async () => {
      try {
        setLoading(true);

        const data = {
          id: adminId,
        };

        const response = await fetch("/api/admins", {
          method: "DELETE",
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          setLoading(false);
          return;
        }

        toast.success(responseData.message);
        setGData(true);
        setDelAdmin(false);
      } catch (err) {
        console.log(err);
        toast.error("Data not sent, try again later!");
      }
    };

    if (confirm) {
      deleteAdmin();
      setConfirm(false);
    }
  }, [confirm]);

  return (
    <div className={`${styles.container} flex items-center justify-center`}>
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6">
        <div className="flex justify-between mb-5">
          <h1 className="font-semibold">Remove Admin</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setDelAdmin(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>

        <div>
          <h3 className="text-xl">
            Are your sure you want to delete this admin?
          </h3>
          <p className="text-red-600 text-sm">This action cannot be undone.</p>
        </div>

        <div className="mt-5 flex justify-end gap-4">
          <button onClick={()=>setDelAdmin(false)} className="bg-red-600 hover:bg-red-700 text-gray-50 p-2 rounded">
            Cancel
          </button>

          <button
            onClick={() => setConfirm(true)}
            disabled={loading}
            className="bg-green-600 disabled:bg-blue-200 hover:bg-green-700 text-gray-50 p-2 rounded"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />{" "}
                Confirm{" "}
              </>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
