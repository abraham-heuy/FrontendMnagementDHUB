import { FaX } from "react-icons/fa6";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  image?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message, image }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative">

        <h2 className="text-xl font-semibold text-green-600 mb-2 text-center">{title}</h2>
        <hr className="w-1/2 mx-auto border-green-300" />

        <p className="mt-3 text-start text-green-700">{message}</p>

        {image && (
          <div className="flex justify-center mt-4">
            <img
              src={image}
              alt="modal illustration"
              className="h-20 w-20 object-contain"
            />
          </div>
        )}

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="absolute top-3 cursor-pointer right-3 px-3 py-1 bg-green-100 text-white rounded-md hover:bg-green-200 transition"
          >
            <FaX /> 
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
