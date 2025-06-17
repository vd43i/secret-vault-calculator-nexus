
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

interface FilesPageProps {
  onBack: () => void;
}

const FilesPage: React.FC<FilesPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [files] = useState([
    {
      id: 1,
      name: 'Important_Document.pdf',
      size: '2.3 MB',
      type: 'PDF',
      dateAdded: '2024-01-15',
      color: 'text-red-400'
    },
    {
      id: 2,
      name: 'Project_Proposal.docx',
      size: '1.8 MB',
      type: 'DOCX',
      dateAdded: '2024-01-14',
      color: 'text-blue-400'
    },
    {
      id: 3,
      name: 'Financial_Report.xlsx',
      size: '5.2 MB',
      type: 'XLSX',
      dateAdded: '2024-01-13',
      color: 'text-green-400'
    },
    {
      id: 4,
      name: 'Presentation.pptx',
      size: '12.1 MB',
      type: 'PPTX',
      dateAdded: '2024-01-12',
      color: 'text-orange-400'
    }
  ]);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = () => {
    // Simulate file upload
    console.log('File upload triggered');
  };

  const handleDownload = (fileName: string) => {
    console.log(`Downloading: ${fileName}`);
  };

  const handleDelete = (fileId: number, fileName: string) => {
    console.log(`Deleting file: ${fileName}`);
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
              <h1 className="text-2xl font-bold text-white">Files Manager</h1>
            </div>
          </div>
          
          <button
            onClick={handleFileUpload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Upload File</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
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
        <div className="mb-6 p-8 rounded-xl border-2 border-dashed border-gray-600 bg-gray-800/30 hover:border-blue-500 transition-colors cursor-pointer">
          <div className="text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Drop files here to upload</h3>
            <p className="text-sm text-gray-400 mb-4">or click to browse your computer</p>
            <button
              onClick={handleFileUpload}
              className="px-6 py-2 rounded-lg bg-blue-600/20 border border-blue-600/30 text-blue-400 hover:bg-blue-600/30 transition-colors"
            >
              Choose Files
            </button>
          </div>
        </div>

        {/* Files List */}
        <div className="space-y-3">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <File className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No files found</h3>
              <p className="text-sm text-gray-500">
                {searchQuery ? 'Try a different search term' : 'Upload your first file to get started'}
              </p>
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gray-700">
                      <File className={`h-6 w-6 ${file.color}`} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">{file.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{file.type}</span>
                        <span>{file.size}</span>
                        <span>Added {file.dateAdded}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(file.name)}
                      className="p-2 rounded-lg bg-green-600/20 border border-green-600/30 text-green-400 hover:bg-green-600/30 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id, file.name)}
                      className="p-2 rounded-lg bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-colors"
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
            <span className="text-gray-400">Storage Used</span>
            <span className="text-white">2.3 GB of 10 GB</span>
          </div>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesPage;
