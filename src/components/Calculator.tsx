
import React, { useState } from 'react';
import { Calculator as CalcIcon, History, Lock } from 'lucide-react';

interface CalculatorProps {
  onSecretAccess: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onSecretAccess }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(display);
    } else if (operation) {
      const currentValue = previousValue || '0';
      const result = calculate(parseFloat(currentValue), inputValue, operation);
      
      setDisplay(String(result));
      setPreviousValue(String(result));
      
      // Check for secret access code
      if (String(result) === '1337') {
        setTimeout(() => {
          onSecretAccess();
        }, 1000);
        return;
      }
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    if (previousValue !== null && operation) {
      const inputValue = parseFloat(display);
      const currentValue = parseFloat(previousValue);
      const result = calculate(currentValue, inputValue, operation);
      
      const calculation = `${previousValue} ${operation} ${display} = ${result}`;
      setHistory(prev => [calculation, ...prev.slice(0, 9)]);
      
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
      
      // Check for secret access code
      if (String(result) === '1337') {
        setTimeout(() => {
          onSecretAccess();
        }, 1000);
      }
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  const getButtonClass = (button: string) => {
    const baseClass = "h-16 rounded-xl font-semibold text-lg transition-all duration-200 active:scale-95";
    
    if (['÷', '×', '-', '+', '='].includes(button)) {
      return `${baseClass} bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 shadow-lg`;
    } else if (['C', '±', '%'].includes(button)) {
      return `${baseClass} bg-gradient-to-br from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800`;
    } else {
      return `${baseClass} bg-gradient-to-br from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800`;
    }
  };

  const handleButtonClick = (button: string) => {
    if (button === 'C') {
      clearDisplay();
    } else if (button === '=') {
      performCalculation();
    } else if (['÷', '×', '-', '+'].includes(button)) {
      inputOperation(button);
    } else if (button === '±') {
      setDisplay(String(parseFloat(display) * -1));
    } else if (button === '%') {
      setDisplay(String(parseFloat(display) / 100));
    } else {
      inputNumber(button);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <div className="flex items-center gap-3">
            <CalcIcon className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Calculator</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              <History className="h-5 w-5" />
            </button>
            <div className="p-2 rounded-lg bg-gray-800">
              <Lock className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="mb-4 p-4 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-300">History</h3>
              <button
                onClick={clearHistory}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Clear
              </button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-xs text-gray-500">No calculations yet</p>
              ) : (
                history.map((calc, index) => (
                  <div key={index} className="text-xs text-gray-400 font-mono">
                    {calc}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Display */}
        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg border border-gray-700 shadow-2xl">
          <div className="text-right">
            <div className="text-4xl font-light text-white mb-2 font-mono">
              {display}
            </div>
            {operation && previousValue && (
              <div className="text-sm text-gray-400 font-mono">
                {previousValue} {operation}
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.flat().map((button, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(button)}
              className={`${getButtonClass(button)} ${
                button === '0' ? 'col-span-2' : ''
              }`}
            >
              {button}
            </button>
          ))}
        </div>

        {/* Secret Hint */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            🔒 Secret access available for special calculations
          </p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
