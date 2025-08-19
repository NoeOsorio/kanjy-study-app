import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  variant?: 'default' | 'centered' | 'minimal';
}

export default function PageHeader({ 
  title, 
  description, 
  leftContent, 
  rightContent,
  variant = 'default'
}: PageHeaderProps) {
  const getHeaderClasses = () => {
    switch (variant) {
      case 'centered':
        return 'text-center';
      case 'minimal':
        return 'py-3';
      default:
        return '';
    }
  };

  const getTitleClasses = () => {
    switch (variant) {
      case 'centered':
        return 'text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent';
      case 'minimal':
        return 'text-xl font-bold text-gray-800';
      default:
        return 'text-2xl font-bold text-gray-800';
    }
  };

  const getDescriptionClasses = () => {
    switch (variant) {
      case 'centered':
        return 'text-gray-600 mt-2';
      case 'minimal':
        return 'text-sm text-gray-500';
      default:
        return 'text-sm text-gray-600';
    }
  };

  return (
    <div className={`bg-white shadow-sm px-6 ${variant === 'minimal' ? 'py-3' : 'py-6'} border-b border-gray-100`}>
      <div className={`flex items-center justify-between ${getHeaderClasses()}`}>
        <div className="flex items-center space-x-4">
          {leftContent}
          <div>
            <h1 className={getTitleClasses()}>{title}</h1>
            {description && (
              <p className={getDescriptionClasses()}>{description}</p>
            )}
          </div>
        </div>
        {rightContent && (
          <div className="flex items-center space-x-3">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
}
