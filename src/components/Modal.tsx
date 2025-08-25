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
      <div className="bg-white mx-3 rounded-2xl shadow-xl max-w-md w-full p-6 relative flex flex-col items-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-green-600 hover:text-green-800 transition"
        >
          <FaX size={18} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-green-600 mb-2 text-center">
          {title}
        </h2>
        <hr className="w-1/2 mx-auto border-green-300 mb-4" />

        {/* Image Section */}
        {image && (
          <div className="w-full flex justify-center mb-4">
            <img
              src={image}
              alt="modal illustration"
              className="max-h-52 w-auto object-contain" // allows image to scale nicely
            />
          </div>
        )}

        {/* Message */}
        <p className="text-center text-green-700">{message}</p>
      </div>
    </div>
  );
};

export default Modal;
