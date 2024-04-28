import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const AppointmentSuccess = ({ setBook }) => {
    return (
        <div className="bg-green-100 border border-green-400 text-green-700 px-8 py-6 rounded-lg text-center relative" role="alert">
            <div className="flex justify-center items-center mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2 text-3xl" />
                <strong className="font-bold text-xl">Success!</strong>
            </div>
            <p className="text-sm mb-4">Appointment booked successfully.</p>
            <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md focus:outline-none"
                onClick={()=>setBook(true)}
            >
                Book Again
            </button>
        </div>
    );
};

export default AppointmentSuccess;
