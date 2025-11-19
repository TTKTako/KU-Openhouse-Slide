'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { io, Socket } from 'socket.io-client';

type TransitionState = 'none' | 'idle-to-first' | 'last-to-idle';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(-1); // -1 = idle, 0-7 = slides
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<TransitionState>('none');
  const [slides, setSlides] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [nextSlideQueued, setNextSlideQueued] = useState<number | null>(null);

  useEffect(() => {
    // Fetch slides data
    fetch('/data.json')
      .then((res) => res.json())
      .then((data) => setSlides(data))
      .catch((err) => console.error('Error loading slides:', err));

    // Initialize socket connection
    socketRef.current = io({
      path: '/api/socket',
      addTrailingSlash: false,
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
      // Join the display room to receive commands
      socketRef.current?.emit('join-room', { room: 'displays' });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;

    const handleSlideChange = (data: { action: string }) => {
      console.log('Slide change received:', data.action);
      
      if (data.action === 'next') {
        handleNext();
      } else if (data.action === 'prev') {
        handlePrev();
      } else if (data.action === 'reset') {
        handleReset();
      }
    };

    socketRef.current.on('slide-change', handleSlideChange);

    return () => {
      socketRef.current?.off('slide-change', handleSlideChange);
    };
  }, [slides, currentSlide, isTransitioning, transitionType, nextSlideQueued]);

  const skipVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    handleVideoEnd();
  };

  const handleVideoEnd = () => {
    if (transitionType === 'idle-to-first') {
      const targetSlide = nextSlideQueued !== null ? nextSlideQueued : 0;
      setCurrentSlide(targetSlide);
      setIsTransitioning(false);
      setTransitionType('none');
      setNextSlideQueued(null);
    } else if (transitionType === 'last-to-idle') {
      setCurrentSlide(-1);
      setIsTransitioning(false);
      setTransitionType('none');
      setNextSlideQueued(null);
    }
  };

  const handleNext = () => {
    // Don't proceed if slides aren't loaded yet
    if (slides.length === 0) return;
    
    // Allow clicking through during video transition
    if (isTransitioning) {
      if (transitionType === 'idle-to-first') {
        // Queue multiple next presses during intro video
        const queued = nextSlideQueued !== null ? nextSlideQueued : 0;
        if (queued < slides.length - 1) {
          setNextSlideQueued(queued + 1);
        }
      }
      return;
    }
    
    if (currentSlide === -1) {
      // Transition from idle to first slide with video
      setIsTransitioning(true);
      setTransitionType('idle-to-first');
      setNextSlideQueued(null);
      if (videoRef.current) {
        videoRef.current.play();
      }
    } else if (currentSlide >= 0 && currentSlide < slides.length - 1) {
      // Move to next slide
      setCurrentSlide(currentSlide + 1);
    } else if (currentSlide === slides.length - 1) {
      // Last slide, transition back to idle with video
      setIsTransitioning(true);
      setTransitionType('last-to-idle');
      if (videoRef.current) {
        videoRef.current.play();
      }
    }
  };

  const handlePrev = () => {
    // Don't proceed if slides aren't loaded yet
    if (slides.length === 0) return;
    if (isTransitioning) return;
    
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (currentSlide === 0) {
      // First slide, go back to idle (no video)
      setCurrentSlide(-1);
    }
  };

  const handleReset = () => {
    if (isTransitioning) return;
    setCurrentSlide(-1);
    setTransitionType('none');
  };

  // Show video transition
  if (isTransitioning && transitionType !== 'none') {
    const videoSrc = transitionType === 'idle-to-first' 
      ? '/videos/intro.mp4'  // Video from idle to first slide
      : '/videos/outro.mp4'; // Video from last slide to idle
    
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-black cursor-pointer" onClick={skipVideo}>
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          onEnded={handleVideoEnd}
          autoPlay
          playsInline
        />
        <div className="absolute bottom-8 right-8 z-20">
          <button
            onClick={skipVideo}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg border border-white/40"
          >
            Skip →
          </button>
        </div>
      </div>
    );
  }

  // Idle screen with QR codes
  if (currentSlide === -1) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-800/30 via-transparent to-transparent" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                           radial-gradient(2px 2px at 60% 70%, white, transparent),
                           radial-gradient(1px 1px at 50% 50%, white, transparent),
                           radial-gradient(1px 1px at 80% 10%, white, transparent),
                           radial-gradient(1px 1px at 90% 60%, white, transparent),
                           radial-gradient(2px 2px at 33% 50%, white, transparent),
                           radial-gradient(1px 1px at 70% 40%, white, transparent)`,
          backgroundSize: '200% 200%, 180% 180%, 150% 150%, 220% 220%, 190% 190%, 160% 160%, 210% 210%',
          backgroundPosition: '0% 0%, 20% 20%, 40% 40%, 60% 60%, 80% 80%, 10% 90%, 50% 10%',
          opacity: 0.3
        }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h1 className="text-7xl font-bold text-white mb-4 drop-shadow-2xl">คณะวิศวกรรมศาสตร์</h1>
            <p className="text-3xl text-amber-200 font-semibold">มหาวิทยาลัยเกษตรศาสตร์</p>
          </div>
          
          <div className="flex items-center justify-center gap-24">
            <div className="flex flex-col items-center gap-6 transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-5xl font-bold text-amber-300 mb-4 drop-shadow-lg">หลักสูตร CPE</h2>
              <div className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-amber-300">
                <Image
                  src="/cpe.png"
                  alt="CPE QR Code"
                  width={400}
                  height={400}
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-xl text-gray-200 font-medium">วิศวกรรมคอมพิวเตอร์</p>
            </div>
            
            <div className="flex flex-col items-center gap-6 transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-5xl font-bold text-amber-300 mb-4 drop-shadow-lg">หลักสูตร SKE</h2>
              <div className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-amber-300">
                <Image
                  src="/ske.png"
                  alt="SKE QR Code"
                  width={400}
                  height={400}
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-xl text-gray-200 font-medium">วิศวกรรมซอฟต์แวร์และความรู้</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show current slide with professional presentation styling
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                         radial-gradient(2px 2px at 60% 70%, white, transparent),
                         radial-gradient(1px 1px at 50% 50%, white, transparent),
                         radial-gradient(1px 1px at 80% 10%, white, transparent),
                         radial-gradient(1px 1px at 90% 60%, white, transparent),
                         radial-gradient(2px 2px at 33% 50%, white, transparent),
                         radial-gradient(1px 1px at 70% 40%, white, transparent)`,
        backgroundSize: '200% 200%, 180% 180%, 150% 150%, 220% 220%, 190% 190%, 160% 160%, 210% 210%',
        backgroundPosition: '0% 0%, 20% 20%, 40% 40%, 60% 60%, 80% 80%, 10% 90%, 50% 10%',
        opacity: 0.2
      }} />
      
      {/* Slide indicator */}
      <div className="absolute top-8 right-8 z-20 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
        <p className="text-white text-lg font-semibold">
          {currentSlide + 1} / {slides.length}
        </p>
      </div>
      
      {/* Slide title */}
      {slides[currentSlide] && (
        <div className="absolute top-8 left-8 z-20 bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/30 shadow-2xl">
          <h2 className="text-white text-2xl font-bold drop-shadow-lg">
            {slides[currentSlide].title}
          </h2>
        </div>
      )}
      
      <div className="relative z-10 w-full h-full flex items-center justify-center p-16">
        {slides[currentSlide] && (
          <div className="relative w-full h-full max-w-7xl">
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        )}
      </div>
      
      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-12 bg-blue-500'
                : 'w-3 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}


