'use client';

import { useEffect, useRef, useState } from 'react';
import { triggerSlideChange } from '@/lib/pusher';

export default function Remote() {
  const [isConnected, setIsConnected] = useState(true);
  const [displayCount, setDisplayCount] = useState(0);

  const handleReset = async () => {
    try {
      await triggerSlideChange('reset');
    } catch (error) {
      console.error('Failed to send reset command:', error);
    }
  };

  const handleNext = async () => {
    try {
      await triggerSlideChange('next');
    } catch (error) {
      console.error('Failed to send next command:', error);
    }
  };

  const handlePrev = async () => {
    try {
      await triggerSlideChange('prev');
    } catch (error) {
      console.error('Failed to send prev command:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Remote Control
            </h1>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <p className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
            {isConnected && (
              <div className="mt-2 px-4 py-2 bg-blue-100 rounded-lg">
                <p className="text-sm font-semibold text-blue-800">
                  🖥️ Broadcasting to ALL displays
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={handleReset}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              <div className="flex items-center justify-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Reset to Idle</span>
              </div>
            </button>

            <button
              onClick={handlePrev}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              <div className="flex items-center justify-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>Previous Slide</span>
              </div>
            </button>

            <button
              onClick={handleNext}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              <div className="flex items-center justify-center gap-3">
                <span>Next Slide</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-600 text-center">
              Website by @TTKTako (TarKubz) for Open House 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

