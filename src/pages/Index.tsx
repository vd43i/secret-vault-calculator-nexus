
import React, { useState, useEffect } from 'react';
import Calculator from '../components/Calculator';
import VaultLogin from '../components/VaultLogin';
import VaultDashboard from '../components/VaultDashboard';
import FilesPage from '../components/vault/FilesPage';
import GalleryPage from '../components/vault/GalleryPage';
import NotesPage from '../components/vault/NotesPage';
import { useToast } from "@/hooks/use-toast";

type AppState = 'calculator' | 'vault-login' | 'vault-dashboard' | 'files' | 'gallery' | 'notes' | 'trash' | 'settings';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('calculator');
  const { toast } = useToast();

  const handleSecretAccess = () => {
    toast({
      title: "🔓 Secret Access Detected",
      description: "Redirecting to secure vault...",
      duration: 2000,
    });
    
    setTimeout(() => {
      setCurrentState('vault-login');
    }, 1000);
  };

  const handleVaultLogin = () => {
    toast({
      title: "🔒 Access Granted",
      description: "Welcome to your secure vault",
      duration: 2000,
    });
    setCurrentState('vault-dashboard');
  };

  const handleVaultLogout = () => {
    toast({
      title: "🔐 Vault Locked",
      description: "Your data is secure",
      duration: 2000,
    });
    setCurrentState('calculator');
  };

  const handleNavigation = (page: string) => {
    setCurrentState(page as AppState);
  };

  const handleBackToVault = () => {
    setCurrentState('vault-dashboard');
  };

  const renderCurrentPage = () => {
    switch (currentState) {
      case 'calculator':
        return <Calculator onSecretAccess={handleSecretAccess} />;
      
      case 'vault-login':
        return (
          <VaultLogin 
            onLogin={handleVaultLogin} 
            onBack={() => setCurrentState('calculator')} 
          />
        );
      
      case 'vault-dashboard':
        return (
          <VaultDashboard 
            onLogout={handleVaultLogout}
            onNavigate={handleNavigation}
          />
        );
      
      case 'files':
        return <FilesPage onBack={handleBackToVault} />;
      
      case 'gallery':
        return <GalleryPage onBack={handleBackToVault} />;
      
      case 'notes':
        return <NotesPage onBack={handleBackToVault} />;
      
      case 'trash':
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Trash Bin</h2>
              <p className="text-gray-400 mb-4">Feature coming soon...</p>
              <button
                onClick={handleBackToVault}
                className="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              >
                Back to Vault
              </button>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
              <p className="text-gray-400 mb-4">Security and vault settings coming soon...</p>
              <button
                onClick={handleBackToVault}
                className="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              >
                Back to Vault
              </button>
            </div>
          </div>
        );
      
      default:
        return <Calculator onSecretAccess={handleSecretAccess} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentPage()}
    </div>
  );
};

export default Index;
