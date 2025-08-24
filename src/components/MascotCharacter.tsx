interface MascotCharacterProps {
  variant?: 'happy' | 'excited' | 'thinking' | 'celebrating';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function MascotCharacter({ 
  variant = 'happy', 
  size = 'md',
  className = '' 
}: MascotCharacterProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-16 h-16';
      case 'lg': return 'w-24 h-24';
      default: return 'w-20 h-20';
    }
  };

  const getMascotContent = () => {
    switch (variant) {
      case 'excited':
        return (
          <div className="relative">
            {/* Cuerpo principal */}
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-gamified">
              {/* Ojos emocionados */}
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                </div>
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
            {/* Brazos emocionados */}
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-green-500 rounded-full animate-bounce"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            {/* Estrella de celebración */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 text-lg animate-pulse">⭐</div>
          </div>
        );
      
      case 'thinking':
        return (
          <div className="relative">
            {/* Cuerpo principal */}
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-gamified">
              {/* Ojos pensativos */}
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                </div>
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
            {/* Signo de interrogación */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-blue-400 text-lg animate-pulse">❓</div>
            {/* Mano en la barbilla */}
            <div className="absolute -bottom-2 right-0 w-4 h-4 bg-blue-500 rounded-full"></div>
          </div>
        );
      
      case 'celebrating':
        return (
          <div className="relative">
            {/* Cuerpo principal */}
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-gamified">
              {/* Ojos celebrando */}
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                </div>
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
            {/* Confeti */}
            <div className="absolute -top-2 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute -top-1 -right-2 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="absolute -top-3 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            {/* Corona */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 text-lg animate-pulse">👑</div>
          </div>
        );
      
      default: // happy
        return (
          <div className="relative">
            {/* Cuerpo principal */}
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-gamified">
              {/* Ojos felices */}
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                </div>
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
            {/* Sonrisa */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-white rounded-full"></div>
            {/* Mejillas rosadas */}
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-pink-300 rounded-full opacity-60"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-pink-300 rounded-full opacity-60"></div>
          </div>
        );
    }
  };

  return (
    <div className={`${getSizeClasses()} ${className} transition-all duration-200 hover:scale-105 cursor-pointer`}>
      {getMascotContent()}
    </div>
  );
}
