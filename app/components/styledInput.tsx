// app/components/StyledInput.tsx
import React, { InputHTMLAttributes } from 'react';

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string; // Optional error message
  showCharCount?: boolean;
}

const StyledInput: React.FC<StyledInputProps> = ({
  label,
  id,
  error,
  className,
  value,
  maxLength,
  showCharCount = false,
  ...props
}) => {
  const baseClasses = "w-full p-2.5 bg-white border border-gray-300 rounded-full shadow-sm appearance-none";
  const focusClasses = "focus:outline-none";
  // If you want a different color for focus ring, e.g., blue:
  // const focusClasses = "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent";

  const errorClasses = error ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {props.required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        value={value}
        maxLength={maxLength}
        {...props}
        className={`${baseClasses} ${focusClasses} ${errorClasses} ${className || ''}`}
      />
      {showCharCount && maxLength && (
        <div className="text-xs text-gray-500 text-right mt-1">
          {String(value || '').length}/{maxLength}
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default StyledInput;