
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyles = "px-6 py-3 font-doodle font-bold transition-all duration-200 active:scale-90 flex items-center justify-center gap-2 select-none";
  
  const variants = {
    primary: "bg-neutral-800 text-white border-2 border-neutral-800 rounded-[30px_10px_40px_15px/15px_40px_10px_30px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-1",
    secondary: "bg-white text-neutral-800 border-2 border-neutral-800 rounded-[15px_30px_10px_40px/40px_10px_30px_15px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1",
    ghost: "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100/50 rounded-xl",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
