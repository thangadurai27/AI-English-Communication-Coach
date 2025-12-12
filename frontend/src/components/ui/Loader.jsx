import React from 'react';

const Loader = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-primary-light/30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      {text && (
        <p className="text-text-secondary dark:text-text-dark animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default Loader;
