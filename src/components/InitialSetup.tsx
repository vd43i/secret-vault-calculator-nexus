
import React, { useState } from 'react';
import { Shield, Check } from 'lucide-react';

interface InitialSetupProps {
  onSetupComplete: (password: string) => void;
}

const InitialSetup: React.FC<InitialSetupProps> = ({ onSetupComplete }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      if (confirmPassword.length > 0) {
        setConfirmPassword(prev => prev.slice(0, -1));
      } else {
        setPassword(prev => prev.slice(0, -1));
      }
    } else if (key === 'clear') {
      setPassword('');
      setConfirmPassword('');
    } else if (password.length < 8 && confirmPassword.length === 0) {
      setPassword(prev => prev + key);
    } else if (confirmPassword.length < 8 && password.length === 8) {
      setConfirmPassword(prev => prev + key);
    }
  };

  const handleSetup = () => {
    if (password.length < 4) {
      setError('كلمة المرور يجب أن تكون 4 أرقام على الأقل');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('كلمة المرور غير متطابقة');
      setConfirmPassword('');
      return;
    }

    localStorage.setItem('vault_password', password);
    localStorage.setItem('vault_setup_complete', 'true');
    onSetupComplete(password);
  };

  const keypadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'delete']
  ];

  const currentStep = password.length === 0 ? 'password' : confirmPassword.length < password.length ? 'confirm' : 'ready';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 mb-4">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">إعداد الخزنة</h1>
          <p className="text-gray-300">قم بإنشاء كلمة مرور للخزنة السرية</p>
        </div>

        {/* Current Step Indicator */}
        <div className="mb-6 text-center">
          <p className="text-sm text-blue-300 mb-2">
            {currentStep === 'password' && 'أدخل كلمة المرور (4-8 أرقام)'}
            {currentStep === 'confirm' && 'أعد إدخال كلمة المرور للتأكيد'}
            {currentStep === 'ready' && 'جاهز للحفظ'}
          </p>
        </div>

        {/* Password Display */}
        <div className="mb-6 space-y-4">
          {/* Original Password */}
          <div className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
            <div className="text-center mb-2">
              <span className="text-sm text-gray-300">كلمة المرور</span>
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

          {/* Confirm Password */}
          {password.length >= 4 && (
            <div className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
              <div className="text-center mb-2">
                <span className="text-sm text-gray-300">تأكيد كلمة المرور</span>
              </div>
              <div className="flex justify-center gap-2">
                {Array.from({ length: password.length }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index < confirmPassword.length
                        ? confirmPassword[index] === password[index]
                          ? 'bg-green-400 shadow-lg shadow-green-400/30'
                          : 'bg-red-400 shadow-lg shadow-red-400/30'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-800">
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {currentStep === 'ready' && (
          <div className="mb-4 p-3 rounded-lg bg-green-900/30 border border-green-800 flex items-center gap-2">
            <Check className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-400">كلمة المرور متطابقة! يمكنك الآن الحفظ</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {keypadNumbers.flat().map((key, index) => (
            <button
              key={index}
              onClick={() => handleKeyPress(key)}
              className={`h-14 rounded-xl font-semibold text-lg transition-all duration-200 active:scale-95 ${
                key === 'clear'
                  ? 'bg-gradient-to-br from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                  : key === 'delete'
                  ? 'bg-gradient-to-br from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                  : 'bg-gradient-to-br from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800'
              }`}
            >
              {key === 'delete' ? '⌫' : key === 'clear' ? 'مسح' : key}
            </button>
          ))}
        </div>

        {/* Setup Button */}
        <button
          onClick={handleSetup}
          disabled={currentStep !== 'ready'}
          className="w-full h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold hover:from-blue-600 hover:to-blue-800 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          حفظ وإنشاء الخزنة
        </button>

        {/* Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 ستحتاج لكتابة كلمة المرور في الآلة الحاسبة والضغط على "=" للدخول للخزنة</p>
        </div>
      </div>
    </div>
  );
};

export default InitialSetup;
