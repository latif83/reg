import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./share.module.css";
import { faCopy, faTimes } from "@fortawesome/free-solid-svg-icons";

export const ShareApointment = ({setShareLink}) => {
  return (
    <div className={`${styles.container} flex items-center justify-center`}>
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6">
      <div className="flex justify-between mb-5">
          <h1 className="font-semibold">Share</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setShareLink(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>
        <h1 className="font-bold text-lg">Appointment Link</h1>
        <div className="mt-2">
            <button className="rounded bg-black text-white p-3">
                <FontAwesomeIcon icon={faCopy} className="mr-2" />
                Copy
            </button>
        </div>
      </div>
    </div>
  );
};