
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Shield, 
  Key,
  Trash2,
  HardDrive,
  Download,
  Upload,
  Settings,
  AlertTriangle,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SettingsPageProps {
  onBack: () => void;
  onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, onLogout }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [autoLock, setAutoLock] = useState(true);
  const [lockTime, setLockTime] = useState('5');
  const { toast } = useToast();

  const handleChangePassword = () => {
    const savedPassword = localStorage.getItem('vault_password') || '1337';
    
    if (currentPassword !== savedPassword) {
      toast({
        title: "❌ خطأ",
        description: "كلمة المرور الحالية غير صحيحة",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (newPassword.length < 4) {
      toast({
        title: "❌ خطأ",
        description: "كلمة المرور الجديدة يجب أن تكون 4 أرقام على الأقل",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "❌ خطأ",
        description: "كلمة المرور الجديدة غير متطابقة",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    localStorage.setItem('vault_password', newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    toast({
      title: "✅ تم بنجاح",
      description: "تم تغيير كلمة المرور بنجاح",
      duration: 3000,
    });
  };

  const handleExportData = () => {
    const data = {
      vault_password: localStorage.getItem('vault_password'),
      vault_setup_complete: localStorage.getItem('vault_setup_complete'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "✅ تم التصدير",
      description: "تم تصدير بيانات الخزنة بنجاح",
      duration: 3000,
    });
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (data.vault_password) {
              localStorage.setItem('vault_password', data.vault_password);
              localStorage.setItem('vault_setup_complete', data.vault_setup_complete || 'true');
              toast({
                title: "✅ تم الاستيراد",
                description: "تم استيراد بيانات الخزنة بنجاح",
                duration: 3000,
              });
            }
          } catch (error) {
            toast({
              title: "❌ خطأ",
              description: "فشل في قراءة ملف النسخ الاحتياطي",
              variant: "destructive",
              duration: 3000,
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearAllData = () => {
    if (confirm('هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه!')) {
      localStorage.clear();
      toast({
        title: "✅ تم الحذف",
        description: "تم حذف جميع البيانات بنجاح",
        duration: 2000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const handleAutoLockChange = (enabled: boolean) => {
    setAutoLock(enabled);
    localStorage.setItem('vault_auto_lock', enabled.toString());
    localStorage.setItem('vault_lock_time', lockTime);
    
    toast({
      title: enabled ? "🔒 تم التفعيل" : "🔓 تم التعطيل",
      description: enabled ? `سيتم قفل الخزنة تلقائياً بعد ${lockTime} دقائق` : "تم إلغاء القفل التلقائي",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">إعدادات الخزنة</h1>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Security Settings */}
          <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">إعدادات الأمان</h2>
            </div>

            {/* Change Password */}
            <div className="space-y-4 mb-6">
              <h3 className="text-md font-medium text-gray-300 flex items-center gap-2">
                <Key className="h-4 w-4" />
                تغيير كلمة المرور
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="كلمة المرور الحالية"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="كلمة المرور الجديدة"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="تأكيد كلمة المرور"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showPasswords ? 'إخفاء كلمات المرور' : 'إظهار كلمات المرور'}
                </button>
                
                <button
                  onClick={handleChangePassword}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  تغيير كلمة المرور
                </button>
              </div>
            </div>

            {/* Auto Lock */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30">
              <div>
                <h3 className="text-white font-medium">القفل التلقائي</h3>
                <p className="text-sm text-gray-400">قفل الخزنة تلقائياً بعد فترة من عدم النشاط</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={lockTime}
                  onChange={(e) => setLockTime(e.target.value)}
                  className="px-3 py-1 rounded bg-gray-600 text-white text-sm"
                  disabled={!autoLock}
                >
                  <option value="1">1 دقيقة</option>
                  <option value="5">5 دقائق</option>
                  <option value="10">10 دقائق</option>
                  <option value="30">30 دقيقة</option>
                </select>
                <button
                  onClick={() => handleAutoLockChange(!autoLock)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    autoLock ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    autoLock ? 'translate-x-6' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Storage Management */}
          <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <HardDrive className="h-5 w-5 text-green-400" />
              <h2 className="text-lg font-semibold text-white">إدارة التخزين</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleExportData}
                className="flex items-center gap-3 p-4 rounded-lg bg-green-600/20 border border-green-600/30 text-green-400 hover:bg-green-600/30 transition-colors"
              >
                <Download className="h-5 w-5" />
                <div className="text-left">
                  <h3 className="font-medium">تصدير البيانات</h3>
                  <p className="text-sm opacity-80">نسخ احتياطي من إعدادات الخزنة</p>
                </div>
              </button>

              <button
                onClick={handleImportData}
                className="flex items-center gap-3 p-4 rounded-lg bg-blue-600/20 border border-blue-600/30 text-blue-400 hover:bg-blue-600/30 transition-colors"
              >
                <Upload className="h-5 w-5" />
                <div className="text-left">
                  <h3 className="font-medium">استيراد البيانات</h3>
                  <p className="text-sm opacity-80">استعادة من نسخة احتياطية</p>
                </div>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 rounded-xl bg-red-900/20 border border-red-800/30">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h2 className="text-lg font-semibold text-red-400">المنطقة الخطيرة</h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleClearAllData}
                className="flex items-center gap-3 p-4 rounded-lg bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-colors w-full"
              >
                <Trash2 className="h-5 w-5" />
                <div className="text-left">
                  <h3 className="font-medium">حذف جميع البيانات</h3>
                  <p className="text-sm opacity-80">حذف نهائي لجميع الملفات والإعدادات</p>
                </div>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-3 p-4 rounded-lg bg-gray-600/20 border border-gray-600/30 text-gray-400 hover:bg-gray-600/30 transition-colors w-full"
              >
                <ArrowLeft className="h-5 w-5" />
                <div className="text-left">
                  <h3 className="font-medium">تسجيل الخروج</h3>
                  <p className="text-sm opacity-80">العودة إلى الآلة الحاسبة</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
