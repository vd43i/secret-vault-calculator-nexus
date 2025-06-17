
import React, { useState } from 'react';
import { Lock, Shield, AlertCircle } from 'lucide-react';

interface VaultLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const VaultLogin: React.FC<VaultLoginProps> = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState('');

  const correctPassword = '1337';
  const maxAttempts = 3;

  const handleLogin = () => {
    if (isLocked) {
      setError('Too many failed attempts. Please wait.');
      return;
    }

    if (password === correctPassword) {
      setError('');
      onLogin();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= maxAttempts) {
        setIsLocked(true);
        setError('Vault locked due to multiple failed attempts');
        setTimeout(() => {
          setIsLocked(false);
          setAttempts(0);
          setError('');
        }, 30000);
      } else {
        setError(`Incorrect password. ${maxAttempts - newAttempts} attempts remaining.`);
      }
      
      setPassword('');
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      setPassword(prev => prev.slice(0, -1));
    } else if (key === 'clear') {
      setPassword('');
    } else if (password.length < 8) {
      setPassword(prev => prev + key);
    }
  };

  const keypadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'delete']
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 mb-4">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Secure Vault</h1>
          <p className="text-gray-400">Enter your access code</p>
        </div>

        {/* Password Display */}
        <div className="mb-6 p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-300">Access Code</span>
          </div>
          <div className="flex justify-center gap-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index < password.length
                    ? 'bg-blue-400 shadow-lg shadow-blue-400/30'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {keypadNumbers.flat().map((key, index) => (
            <button
              key={index}
              onClick={() => handleKeyPress(key)}
              disabled={isLocked}
              className={`h-14 rounded-xl font-semibold text-lg transition-all duration-200 active:scale-95 ${
                key === 'clear'
                  ? 'bg-gradient-to-br from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                  : key === 'delete'
                  ? 'bg-gradient-to-br from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                  : 'bg-gradient-to-br from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800'
              } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {key === 'delete' ? '⌫' : key === 'clear' ? 'Clear' : key}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleLogin}
            disabled={password.length === 0 || isLocked}
            className="w-full h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold hover:from-blue-600 hover:to-blue-800 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLocked ? 'Vault Locked' : 'Enter Vault'}
          </button>

          <button
            onClick={onBack}
            className="w-full h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 text-white font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 active:scale-95"
          >
            Back to Calculator
          </button>
        </div>

        {/* Security Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Vault will lock after {maxAttempts} failed attempts</p>
          {isLocked && (
            <p className="text-red-400 mt-1">Unlock in 30 seconds</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaultLogin;
