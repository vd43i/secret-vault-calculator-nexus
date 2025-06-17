
import React, { useState } from 'react';
import { 
  File, 
  Image, 
  BookOpen, 
  Settings, 
  Trash2, 
  LogOut,
  Folder,
  Shield,
  HardDrive
} from 'lucide-react';

interface VaultDashboardProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const VaultDashboard: React.FC<VaultDashboardProps> = ({ onLogout, onNavigate }) => {
  const [stats] = useState({
    files: 0,
    images: 0,
    notes: 0,
    storage: '0 GB'
  });

  const menuItems = [
    {
      id: 'files',
      title: 'مدير الملفات',
      description: 'رفع وتنظيم وإدارة ملفاتك',
      icon: File,
      color: 'from-blue-500 to-blue-700',
      stats: `${stats.files} ملف`
    },
    {
      id: 'gallery',
      title: 'معرض الصور',
      description: 'عرض وتنظيم صورك',
      icon: Image,
      color: 'from-green-500 to-green-700',
      stats: `${stats.images} صورة`
    },
    {
      id: 'notes',
      title: 'الملاحظات',
      description: 'إنشاء وتحرير الملاحظات الخاصة',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-700',
      stats: `${stats.notes} ملاحظة`
    },
    {
      id: 'trash',
      title: 'سلة المحذوفات',
      description: 'استعادة العناصر المحذوفة',
      icon: Trash2,
      color: 'from-red-500 to-red-700',
      stats: 'فارغة'
    },
    {
      id: 'settings',
      title: 'الإعدادات',
      description: 'إعدادات الأمان والتخزين',
      icon: Settings,
      color: 'from-gray-500 to-gray-700',
      stats: 'تكوين'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">الخزنة الآمنة</h1>
              <p className="text-sm text-gray-400">خزنتك الرقمية الخاصة</p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">تسجيل خروج</span>
          </button>
        </div>

        {/* Storage Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <Folder className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">إجمالي الملفات</p>
                <p className="text-lg font-semibold text-white">{stats.files}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <Image className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">الصور</p>
                <p className="text-lg font-semibold text-white">{stats.images}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">الملاحظات</p>
                <p className="text-lg font-semibold text-white">{stats.notes}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <HardDrive className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">التخزين</p>
                <p className="text-lg font-semibold text-white">{stats.storage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group p-6 rounded-2xl bg-gray-800/50 backdrop-blur-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 text-left hover:scale-105"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                
                <p className="text-sm text-gray-400 mb-3">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {item.stats}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-green-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 rounded-xl bg-blue-900/20 border border-blue-800/30">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-400 mb-1">إشعار الأمان</h4>
              <p className="text-xs text-gray-400">
                خزنتك محمية بتشفير من طرف إلى طرف. جميع البيانات مخزنة بأمان ولا يمكن الوصول إليها إلا برمز الوصول الخاص بك.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultDashboard;
