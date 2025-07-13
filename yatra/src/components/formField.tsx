import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export const FormField = ({
  label,
  htmlFor,
  error,
  className = "",
  children,
}: FormFieldProps) => {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};