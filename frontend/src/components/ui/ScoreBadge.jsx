import React from 'react';

const ScoreBadge = ({ score, label = 'Score', size = 'md' }) => {
  const getColor = (score) => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 75) return 'from-blue-500 to-indigo-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-orange-500 to-red-600';
  };
  
  const sizes = {
    sm: 'text-sm px-3 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  
  return (
    <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${getColor(score)} 
      text-white font-bold rounded-full ${sizes[size]} shadow-md`}>
      <span className="text-xs opacity-90">{label}</span>
      <span>{score}%</span>
    </div>
  );
};

export default ScoreBadge;
