import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerAction,
  className = '',
  padding = 'md',
  hoverable = false,
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hoverable 
    ? 'transition-shadow duration-200 hover:shadow-card-hover cursor-pointer' 
    : '';

  return (
    <div className={`bg-white rounded-lg border border-secondary-200 shadow-card ${hoverStyles} ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className={`border-b border-secondary-200 ${paddingStyles[padding]}`}>
          <div className="flex items-start justify-between">
            <div>
              {title && <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>}
              {subtitle && <p className="text-sm text-secondary-600 mt-1">{subtitle}</p>}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}
      <div className={title || subtitle || headerAction ? paddingStyles[padding] : paddingStyles[padding]}>
        {children}
      </div>
    </div>
  );
};

export default Card;
