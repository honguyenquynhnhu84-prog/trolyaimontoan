import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/60 overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-slate-100 bg-slate-50/50 ${className}`}>
    {children}
  </div>
);

export const CardBody: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-slate-100 bg-slate-50/50 ${className}`}>
    {children}
  </div>
);
