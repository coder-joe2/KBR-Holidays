import React, { useState, useRef } from 'react';
import { Plus, Trash2, Bus, Image as ImageIcon, Check, X, Upload, Layers, Loader2 } from 'lucide-react';

export interface BusItem {
  id: string;
  name: string;
  photoUrl: string;
  photos: string[];
  createdAt: number;
}

interface AddBusesPageProps {
  buses: BusItem[];
  onAddBus: (bus: Omit<BusItem, 'id' | 'createdAt'>) => void;
  onDeleteBus: (id: string) => void;
  onGoToTravels?: () => void;
}

// Client-side image compression to prevent localStorage quota errors
const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return resolve('');

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          resolve(result);
        }
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

export const AddBusesPage: React.FC<AddBusesPageProps> = ({
  buses,
  onAddBus,
  onDeleteBus,
  onGoToTravels,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [busName, setBusName] = useState('');
  const [photosList, setPhotosList] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reliable file change handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setIsProcessing(true);

    try {
      const fileArray = Array.from(files);
      const compressedResults: string[] = [];

      for (const file of fileArray) {
        const base64 = await compressImageFile(file);
        if (base64) {
          compressedResults.push(base64);
        }
      }

      if (compressedResults.length > 0) {
        setPhotosList((prev) => [...prev, ...compressedResults]);
      } else {
        setError('Could not process selected image files.');
      }
    } catch {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsProcessing(false);
      // Reset input value so same files can be re-selected if desired
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Add photo via URL
  const handleAddUrlPhoto = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setPhotosList((prev) => [...prev, trimmed]);
    setUrlInput('');
    setError(null);
  };

  // Remove a photo
  const handleRemovePhoto = (index: number) => {
    setPhotosList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busName.trim()) {
      setError('Please enter the Bus Name');
      return;
    }
    if (photosList.length === 0) {
      setError('Please add at least one Bus Photo');
      return;
    }

    try {
      onAddBus({
        name: busName.trim(),
        photoUrl: photosList[0],
        photos: photosList,
      });

      // Reset and close
      setBusName('');
      setPhotosList([]);
      setUrlInput('');
      setError(null);
      setShowAddModal(false);
    } catch {
      setError('Could not save bus. Please try with fewer or smaller photos.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-bold mb-2">
            <span>Admin Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Fleet
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add buses with multiple photos to display on the Travels page.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Plus Mark Button to Add Buses */}
          <button
            onClick={() => {
              setError(null);
              setPhotosList([]);
              setBusName('');
              setShowAddModal(true);
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Add Bus</span>
          </button>
        </div>
      </div>

      {/* Grid of Existing Added Buses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Current Fleet ({buses.length})
          </h3>
          <span className="text-xs text-slate-500">Live on Travels Page</span>
        </div>

        {buses.length === 0 ? (
          <div
            onClick={() => setShowAddModal(true)}
            className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/30 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center mb-4 transition-colors">
              <Plus className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              No buses added yet
            </h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Click to add a bus with multiple photos and name.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {buses.map((bus) => {
              const photoCount = bus.photos?.length || 1;
              return (
                <div
                  key={bus.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={bus.photoUrl}
                      alt={bus.name}
                      className="w-full h-full object-cover"
                    />

                    {photoCount > 1 && (
                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white rounded-lg text-xs font-semibold">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{photoCount} Photos</span>
                      </div>
                    )}

                    <button
                      onClick={() => onDeleteBus(bus.id)}
                      className="absolute top-2.5 right-2.5 p-2 bg-red-600/90 hover:bg-red-700 text-white rounded-xl shadow-md transition-all cursor-pointer"
                      title="Delete Bus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bus className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-bold text-slate-900 text-sm line-clamp-1">
                        {bus.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal - Multi-photo upload for 1, 4, 7+ photos per bus */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Add New Bus
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Upload multiple bus photos &amp; enter name
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  {error}
                </div>
              )}

              {/* 1. Bus Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Bus Name
                </label>
                <div className="relative">
                  <Bus className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={busName}
                    onChange={(e) => setBusName(e.target.value)}
                    placeholder="e.g. KBR Super Luxury AC Sleeper"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* 2. Bus Photos (Multiple photos: 1, 4, 7, etc.) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Bus Photos ({photosList.length} added)
                  </label>
                  {photosList.length > 0 && (
                    <span className="text-[11px] text-slate-500">
                      Cover: Photo #1
                    </span>
                  )}
                </div>

                {/* Grid of added photos */}
                {photosList.length > 0 && (
                  <div className="grid grid-cols-3 gap-2.5 mb-3">
                    {photosList.map((photo, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-xl overflow-hidden border border-slate-300 h-24 bg-slate-100 group"
                      >
                        <img
                          src={photo}
                          alt={`Bus ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/75 text-white rounded text-[9px] font-bold">
                          {idx === 0 ? 'Cover' : `#${idx + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hidden native file input with ref */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Upload Action Button */}
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-blue-400 hover:border-blue-600 bg-blue-50/50 hover:bg-blue-50 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center transition-all text-center cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2 text-blue-700 py-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-xs font-bold">Processing photos...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-blue-600 mb-1.5" />
                        <span className="text-xs font-bold text-slate-800">
                          {photosList.length === 0
                            ? 'Click to Select Bus Photos from Gallery / Device'
                            : '+ Add Another Photo (Select 1, 4, 7+)'}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          Tap here to browse photos
                        </span>
                      </>
                    )}
                  </button>

                  {/* Add via URL option */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Or paste photo link URL..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddUrlPhoto}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Bus ({photosList.length} Photos)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBusesPage;
