// app/components/StyledTextarea.tsx
import React, { TextareaHTMLAttributes } from 'react';

interface StyledTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string; // Optional error message
}

const StyledTextarea: React.FC<StyledTextareaProps> = ({
  label,
  id,
  error,
  className,
  ...props
}) => {
  const baseClasses = "w-full p-4 bg-white border border-gray-300 rounded-full shadow-sm appearance-none"; // rounded-2xl for textarea
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
      <textarea
        id={id}
        {...props}
        className={`${baseClasses} ${focusClasses} ${errorClasses} ${className || ''}`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default StyledTextarea;