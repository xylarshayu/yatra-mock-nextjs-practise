import React, { FormEvent } from 'react';

interface FormProps {
  onSubmit: (e: FormEvent) => void;
  children: React.ReactNode;
  className?: string;
}

const Form: React.FC<FormProps> = ({ onSubmit, children, className }) => {
  return (
    <form onSubmit={onSubmit} noValidate className={className}>
      {children}
    </form>
  );
};

export default Form;
