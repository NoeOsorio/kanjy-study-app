interface PageHeaderProps {
  title: string;
  description?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
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
        return 'py-4';
      default:
        return '';
    }
  };

  const getTitleClasses = () => {
    switch (variant) {
      case 'centered':
        return 'text-3xl font-bold bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 bg-clip-text text-transparent';
      case 'minimal':
        return 'text-xl font-bold text-gray-800';
      default:
        return 'text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent';
    }
  };

  const getDescriptionClasses = () => {
    switch (variant) {
      case 'centered':
        return 'text-gray-600 mt-2 text-lg';
      case 'minimal':
        return 'text-sm text-gray-500';
      default:
        return 'text-sm text-gray-600';
    }
  };

  return (
    <div className={`bg-white shadow-lg px-6 ${variant === 'minimal' ? 'py-4' : 'py-6'} border-b border-gray-100 relative overflow-hidden`}>
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 opacity-30"></div>
      
      {/* Línea decorativa superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
      
      <div className={`flex items-center justify-between relative z-10 ${getHeaderClasses()}`}>
        <div className="flex items-center space-x-4">
          {leftContent && (
            <div className="flex-shrink-0">
              {leftContent}
            </div>
          )}
          <div>
            <h1 className={`${getTitleClasses()} transition-all duration-200`}>
              {title}
            </h1>
            {description && (
              <p className={`${getDescriptionClasses()} transition-all duration-200`}>
                {description}
              </p>
            )}
          </div>
        </div>
        {rightContent && (
          <div className="flex items-center space-x-3">
            {rightContent}
          </div>
        )}
      </div>
      
      {/* Indicador de progreso sutil en la parte inferior */}
      {variant !== 'minimal' && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200"></div>
      )}
    </div>
  );
}
