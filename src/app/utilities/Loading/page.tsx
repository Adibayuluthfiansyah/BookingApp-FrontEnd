import React, { useState, useEffect } from 'react';

const LoadingAnimation = ({ isLoading = true, onComplete }: { isLoading?: boolean; onComplete?: () => void }) => {
  const [show, setShow] = useState(isLoading);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShow(false);
        onComplete && onComplete();
      }, 500); // Small delay for smooth transition
      
      return () => clearTimeout(timer);
    } else {
      setShow(true);
    }
  }, [isLoading, onComplete]);

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ 
        backgroundColor: '#000000',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      {/* Main Loading Container */}
      <div className="relative flex flex-col items-center space-y-8">
        
        {/* Soccer Field Animation */}
        <div className="relative w-32 h-20 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border border-gray-600">
          {/* Field Lines */}
          <div className="absolute inset-0">
            {/* Center Line */}
            <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white transform -translate-x-0.5"></div>
            {/* Center Circle */}
            <div className="absolute left-1/2 top-1/2 w-8 h-8 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            {/* Goal Areas */}
            <div className="absolute left-0 top-1/2 w-4 h-8 border-2 border-white border-l-0 transform -translate-y-1/2"></div>
            <div className="absolute right-0 top-1/2 w-4 h-8 border-2 border-white border-r-0 transform -translate-y-1/2"></div>
          </div>
          
          {/* Animated Soccer Ball */}
          <div className="absolute top-1/2 transform -translate-y-1/2">
            <div 
              className="w-3 h-3 bg-white rounded-full shadow-lg border border-gray-300"
              style={{
                animation: 'soccerBall 2s ease-in-out infinite',
                left: '10%'
              }}
            >
              {/* Ball Pattern */}
              <div className="absolute inset-0 rounded-full">
                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-black rounded-full"></div>
                <div className="absolute top-1 right-0.5 w-0.5 h-0.5 bg-black rounded-full"></div>
                <div className="absolute bottom-0.5 left-1 w-0.5 h-0.5 bg-black rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pulsing Dots */}
        <div className="flex space-x-2">
          <div 
            className="w-3 h-3 bg-white rounded-full animate-pulse"
            style={{ animationDelay: '0s' }}
          ></div>
          <div 
            className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div 
            className="w-3 h-3 bg-gray-500 rounded-full animate-pulse"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-white animate-pulse">
            LOADING...
          </h3>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
          <div 
            className="h-full bg-gradient-to-r from-gray-400 via-white to-gray-300 rounded-full animate-pulse"
            style={{
              animation: 'progressBar 2s ease-in-out infinite'
            }}
          ></div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-16 h-16 border-4 border-gray-400 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-32 right-20 w-12 h-12 border-4 border-gray-500 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 border-4 border-gray-300 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-32 right-10 w-8 h-8 border-4 border-white rounded-full animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}></div>
      </div>

    </div>
  );
};

export default LoadingAnimation;