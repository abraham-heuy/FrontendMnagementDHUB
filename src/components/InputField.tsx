import { useState } from "react";

interface InputFieldProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  textarea?: boolean;
  required?: boolean;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  textarea,
  required = false
}) => {

  const [focused, setFocused] = useState(false);


  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-xs md:text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {textarea ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={3}
          className={`w-full px-2.5 py-2 text-xs md:text-sm border ${focused ? 'border-green-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 transition-all resize-none`}
          required={required}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full px-2.5 py-2 text-xs md:text-sm border ${focused ? 'border-green-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 transition-all`}
          required={required}
        />
      )}
    </div>
  )
}

export default InputField