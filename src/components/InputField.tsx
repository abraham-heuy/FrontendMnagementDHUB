import { useState } from "react";

interface InputFieldProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  textarea?: boolean;
  required?: boolean;
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
        <label className="block mb-2 font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {textarea ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={4}
          className={`w-full p-3 border ${focused ? 'border-dark/30' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-dark/30 transition-all`}
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
          className={`w-full p-3 border ${focused ? 'border-emerald-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all`}
          required={required}
        />
      )}
    </div>
  )
}

export default InputField