import React, { useEffect, useRef, useState } from 'react';

function App() {
  const widgetRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isButtonAvailable, setIsButtonAvailable] = useState(false);

  useEffect(() => {
    // Wait for the widget to be loaded and check button availability
    const checkButtonAvailability = () => {
      const widget = document.querySelector('elevenlabs-convai');
      if (widget) {
        widgetRef.current = widget;
        const startButton = widget.shadowRoot?.querySelector('button[title="Start a call"]');
        setIsButtonAvailable(!!startButton && !startButton.hasAttribute('disabled'));
      }
    };

    // Initial check
    checkButtonAvailability();

    // Set up periodic checks
    const interval = setInterval(checkButtonAvailability, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartCall = () => {
    if (!widgetRef.current || !isButtonAvailable) return;

    const startButton = widgetRef.current.shadowRoot?.querySelector('button[title="Start a call"]');
    if (startButton && !startButton.hasAttribute('disabled')) {
      startButton.click();
      
      // Add active state animation
      if (containerRef.current) {
        containerRef.current.classList.add('image-active');
        setTimeout(() => {
          containerRef.current?.classList.remove('image-active');
        }, 200);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white relative flex flex-col items-center justify-center p-4">
      {/* App Logo - Top Right */}
      <div className="absolute top-6 right-6">
        <img
          src="/src/alecia-logo-black.png"
          alt="Alecia Logo"
          className="w-12 h-12"
        />
      </div>

      {/* Centered Face Image */}
      <div 
        ref={containerRef}
        className={`relative w-full max-w-md aspect-square mb-8 ${isButtonAvailable ? 'cursor-pointer' : 'cursor-default'} image-container overflow-hidden rounded-full`}
        onClick={handleStartCall}
        role={isButtonAvailable ? 'button' : 'presentation'}
        tabIndex={isButtonAvailable ? 0 : -1}
        onKeyDown={(e) => {
          if (isButtonAvailable && (e.key === 'Enter' || e.key === ' ')) {
            handleStartCall();
          }
        }}
        aria-label={isButtonAvailable ? 'Start a call with AI Assistant' : 'Call button not available'}
      >
        <img
          src="/src/model_1.jpeg"
          alt="AI Assistant - Click to start call"
          className={`w-full h-full object-cover shadow-lg ${isButtonAvailable ? 'hover-float' : ''}`}
        />
        {isButtonAvailable && (
          <div className="absolute inset-0 flex items-end justify-center label-slide-up">
            <div className="bg-black bg-opacity-50 text-white py-3 px-6 mb-8 rounded-full font-medium">
              Start Call
            </div>
          </div>
        )}
      </div>

      {/* Chat Interface */}
      <div className="fixed bottom-4 right-4 z-50">
        <elevenlabs-convai agent-id="h93Ebiy4I83rHClmnuK2"></elevenlabs-convai>
      </div>

      {/* Built by Logo - Bottom Left */}
      <div className="absolute bottom-6 left-6 flex flex-col items-center">
        <p className="text-sm text-gray-600 mb-2">Built by</p>
        <div className="w-24">
          <img
            src="/src/onesevenlogo.png"
            alt="OneSeven Tech"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default App;