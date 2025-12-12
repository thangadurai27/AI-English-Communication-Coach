import React from 'react';

const SectionTitle = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  align = 'left',
  className = '' 
}) => {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  return (
    <div className={`mb-8 ${alignStyles[align]} ${className}`}>
      <div className="flex items-center gap-3 justify-start">
        {Icon && (
          <div className="p-3 bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-glow">
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary dark:text-text-dark">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-2 text-lg text-text-secondary dark:text-text-dark/70">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
