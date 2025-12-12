import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-glow hover:scale-102 active:scale-98 focus:ring-primary',
    secondary: 'bg-gradient-to-r from-accent to-accent-dark text-white hover:shadow-glow-green hover:scale-102 active:scale-98 focus:ring-accent',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white hover:scale-102 active:scale-98 focus:ring-primary',
    ghost: 'text-primary hover:bg-primary/10 hover:scale-102 active:scale-98 focus:ring-primary',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:scale-102 active:scale-98 focus:ring-red-500',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="mr-2 h-5 w-5" />}
      {children}
    </button>
  );
};

export default Button;
