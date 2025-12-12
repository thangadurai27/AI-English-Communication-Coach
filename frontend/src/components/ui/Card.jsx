import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  gradient = false,
  ...props 
}) => {
  const baseStyles = 'bg-white dark:bg-card-dark rounded-2xl shadow-soft p-6 transition-all duration-300';
  const hoverStyles = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
  const gradientStyles = gradient ? 'bg-gradient-to-br from-white to-primary-light/10 dark:from-card-dark dark:to-primary/10' : '';
  
  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${gradientStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
