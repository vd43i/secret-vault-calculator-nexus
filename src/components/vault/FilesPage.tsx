
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  File, 
  Download, 
  Trash2,
  Search,
  Plus,
  Filter
} from 'lucide-react';

interface FileData {
  id: number;
  name: string;
  size: string;
  type: string;
  dateAdded: string;
  color: string;
}

interface FilesPageProps {
  onBack: () => void;
}

const FilesPage: React.FC<FilesPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState<FileData[]>([]);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = () => {
    console.log('File upload triggered');
    // Simulate adding a file for demo
    const newFile: FileData = {
      id: Date.now(),
      name: `Document_${Date.now()}.pdf`,
      size: '1.2 MB',
      type: 'PDF',
      dateAdded: new Date().toISOString().split('T')[0],
      color: 'text-red-400'
    };
    setFiles(prev => [...prev, newFile]);
  };

  const handleDownload = (fileName: string) => {
    console.log(`Downloading: ${fileName}`);
    // Create a simple download simulation
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`This is ${fileName}`));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDelete = (fileId: number, fileName: string) => {
    console.log(`Deleting file: ${fileName}`);
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-8">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <File className="h-6 w-6 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">مدير الملفات</h1>
            </div>
          </div>
          
          <button
            onClick={handleFileUpload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>رفع ملف</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الملفات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button className="px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-700 transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>

        {/* Upload Area */}
        <div 
          onClick={handleFileUpload}
          className="mb-6 p-8 rounded-xl border-2 border-dashed border-gray-600 bg-gray-800/30 hover:border-blue-500 transition-colors cursor-pointer"
        >
          <div className="text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">اسحب الملفات هنا للرفع</h3>
            <p className="text-sm text-gray-400 mb-4">أو انقر لتصفح الكمبيوتر</p>
            <button className="px-6 py-2 rounded-lg bg-blue-600/20 border border-blue-600/30 text-blue-400 hover:bg-blue-600/30 transition-colors">
              اختيار الملفات
            </button>
          </div>
        </div>

        {/* Files List */}
        <div className="space-y-3">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <File className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">لا توجد ملفات</h3>
              <p className="text-sm text-gray-500">
                {searchQuery ? 'جرب كلمة بحث مختلفة' : 'ارفع أول ملف لتبدأ'}
              </p>
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-3 rounded-lg bg-gray-700 flex-shrink-0">
                      <File className={`h-6 w-6 ${file.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-medium mb-1 truncate">{file.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{file.type}</span>
                        <span>{file.size}</span>
                        <span>تم الإضافة {file.dateAdded}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file.name);
                      }}
                      className="p-2 rounded-lg bg-green-600/20 border border-green-600/30 text-green-400 hover:bg-green-600/30 transition-colors"
                      title="تنزيل الملف"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id, file.name);
                      }}
                      className="p-2 rounded-lg bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-colors"
                      title="حذف الملف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Storage Info */}
        <div className="mt-8 p-4 rounded-xl bg-gray-800/30 border border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">مساحة التخزين المستخدمة</span>
            <span className="text-white">{(files.length * 0.5).toFixed(1)} GB من 10 GB</span>
          </div>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min((files.length * 5), 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesPage;
