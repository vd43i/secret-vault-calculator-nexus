
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Trash2,
  Search,
  X,
  Plus
} from 'lucide-react';

interface GalleryPageProps {
  onBack: () => void;
}

const GalleryPage: React.FC<GalleryPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [images, setImages] = useState<Array<{
    id: number;
    name: string;
    url: string;
    size: string;
    dateAdded: string;
  }>>([]);

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageUpload = () => {
    console.log('تم تشغيل رفع الصور');
  };

  const handleDownload = (imageName: string) => {
    console.log(`تحميل: ${imageName}`);
  };

  const handleDelete = (imageId: number, imageName: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
    if (selectedImage === imageId) {
      setSelectedImage(null);
    }
    console.log(`حذف الصورة: ${imageName}`);
  };

  const selectedImageData = selectedImage ? images.find(img => img.id === selectedImage) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
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
              <ImageIcon className="h-6 w-6 text-green-400" />
              <h1 className="text-2xl font-bold text-white">معرض الصور</h1>
            </div>
          </div>
          
          <button
            onClick={handleImageUpload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>رفع صور</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الصور..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors text-right"
              dir="rtl"
            />
          </div>
        </div>

        {/* Upload Area */}
        <div className="mb-6 p-8 rounded-xl border-2 border-dashed border-gray-600 bg-gray-800/30 hover:border-green-500 transition-colors cursor-pointer">
          <div className="text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">اسحب الصور هنا للرفع</h3>
            <p className="text-sm text-gray-400 mb-4">الصيغ المدعومة: JPG, PNG, GIF, WebP</p>
            <button
              onClick={handleImageUpload}
              className="px-6 py-2 rounded-lg bg-green-600/20 border border-green-600/30 text-green-400 hover:bg-green-600/30 transition-colors"
            >
              اختر الصور
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">لا توجد صور</h3>
            <p className="text-sm text-gray-500">
              {searchQuery ? 'جرب مصطلح بحث مختلف' : 'ارفع أول صورة لك للبدء'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-gray-800 hover:scale-105 transition-transform duration-200 cursor-pointer"
                onClick={() => setSelectedImage(image.id)}
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image.name);
                      }}
                      className="p-2 rounded-lg bg-green-600/80 text-white hover:bg-green-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image.id, image.name);
                      }}
                      className="p-2 rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white text-sm font-medium truncate text-right" dir="rtl">{image.name}</h3>
                  <p className="text-gray-300 text-xs">{image.size}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Full Screen Image Modal */}
        {selectedImage && selectedImageData && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800/80 text-white hover:bg-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="relative max-w-4xl max-h-[80vh] flex flex-col">
              <img
                src={selectedImageData.url}
                alt={selectedImageData.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
              <div className="mt-4 p-4 rounded-lg bg-gray-800/80 backdrop-blur-lg">
                <h3 className="text-white text-lg font-semibold mb-2 text-right" dir="rtl">{selectedImageData.name}</h3>
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <span>الحجم: {selectedImageData.size}</span>
                  <span>تاريخ الإضافة: {selectedImageData.dateAdded}</span>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleDownload(selectedImageData.name)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600/20 border border-green-600/30 text-green-400 hover:bg-green-600/30 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>تحميل</span>
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(selectedImageData.id, selectedImageData.name);
                      setSelectedImage(null);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
