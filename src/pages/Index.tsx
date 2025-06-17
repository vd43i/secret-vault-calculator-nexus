
import React, { useState, useEffect } from 'react';
import Calculator from '../components/Calculator';
import VaultLogin from '../components/VaultLogin';
import VaultDashboard from '../components/VaultDashboard';
import FilesPage from '../components/vault/FilesPage';
import GalleryPage from '../components/vault/GalleryPage';
import NotesPage from '../components/vault/NotesPage';
import SettingsPage from '../components/vault/SettingsPage';
import InitialSetup from '../components/InitialSetup';
import { useToast } from "@/hooks/use-toast";

type AppState = 'initial-setup' | 'calculator' | 'vault-login' | 'vault-dashboard' | 'files' | 'gallery' | 'notes' | 'trash' | 'settings';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('calculator');
  const { toast } = useToast();

  useEffect(() => {
    const setupComplete = localStorage.getItem('vault_setup_complete');
    if (!setupComplete) {
      setCurrentState('initial-setup');
    }
  }, []);

  const handleInitialSetup = (password: string) => {
    toast({
      title: "🔐 تم إنشاء الخزنة بنجاح",
      description: "يمكنك الآن استخدام الآلة الحاسبة بشكل طبيعي",
      duration: 3000,
    });
    setCurrentState('calculator');
  };

  const handleSecretAccess = () => {
    toast({
      title: "🔓 تم اكتشاف وصول سري",
      description: "جاري التوجيه للخزنة الآمنة...",
      duration: 2000,
    });
    
    setTimeout(() => {
      setCurrentState('vault-login');
    }, 1000);
  };

  const handleVaultLogin = () => {
    toast({
      title: "🔒 تم منح الوصول",
      description: "مرحباً بك في خزنتك الآمنة",
      duration: 2000,
    });
    setCurrentState('vault-dashboard');
  };

  const handleVaultLogout = () => {
    toast({
      title: "🔐 تم قفل الخزنة",
      description: "بياناتك محمية بأمان",
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
      case 'initial-setup':
        return <InitialSetup onSetupComplete={handleInitialSetup} />;
        
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
      
      case 'settings':
        return <SettingsPage onBack={handleBackToVault} onLogout={handleVaultLogout} />;
      
      case 'trash':
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">سلة المحذوفات</h2>
              <p className="text-gray-400 mb-4">هذه الميزة قادمة قريباً...</p>
              <button
                onClick={handleBackToVault}
                className="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              >
                العودة للخزنة
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
