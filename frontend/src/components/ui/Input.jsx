import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ 
  label, 
  type = 'text', 
  error, 
  icon: Icon,
  className = '',
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label 
          className="block text-sm font-medium text-text-secondary dark:text-text-dark/70 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary dark:text-text-dark/50" />
        )}
        
        <input
          type={inputType}
          className={`w-full px-4 py-3 ${Icon ? 'pl-12' : ''} ${type === 'password' ? 'pr-12' : ''} 
            border-2 rounded-xl transition-all duration-300
            ${error 
              ? 'border-red-500 focus:border-red-600 dark:border-red-600' 
              : 'border-gray-200 dark:border-gray-600 focus:border-primary dark:focus:border-primary-light'
            }
            bg-blue-50 dark:bg-gray-700 text-text-primary dark:text-text-dark
            focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary-light/20
            placeholder:text-text-secondary/50 dark:placeholder:text-text-dark/30`}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-dark/50 hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
