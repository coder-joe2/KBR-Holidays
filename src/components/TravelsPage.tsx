import React, { useState } from 'react';
import {
  Bus,
  Plus,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Layers,
  Copy,
  Check,
  Calendar,
} from 'lucide-react';
import { BusItem } from './AddBusesPage';

interface TravelsPageProps {
  buses: BusItem[];
  isAdmin: boolean;
  onGoToAddBuses?: () => void;
  busBookings?: Record<string, string[]>;
  onOpenBookingDates?: (bus: BusItem) => void;
}

export const TravelsPage: React.FC<TravelsPageProps> = ({
  buses,
  isAdmin,
  onGoToAddBuses,
  busBookings,
  onOpenBookingDates,
}) => {
  const [selectedBus, setSelectedBus] = useState<BusItem | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const handleCopy = (num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const handleOpenBus = (bus: BusItem) => {
    setSelectedBus(bus);
    setActivePhotoIndex(0);
  };

  const busPhotos = selectedBus?.photos?.length
    ? selectedBus.photos
    : selectedBus?.photoUrl
    ? [selectedBus.photoUrl]
    : [];

  const handleNextPhoto = () => {
    if (busPhotos.length > 1) {
      setActivePhotoIndex((prev) => (prev + 1) % busPhotos.length);
    }
  };

  const handlePrevPhoto = () => {
    if (busPhotos.length > 1) {
      setActivePhotoIndex((prev) =>
        prev === 0 ? busPhotos.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-900 rounded-full text-xs font-bold mb-2">
            <Bus className="w-3.5 h-3.5 text-blue-600" />
            <span>KBR Luxury Fleet</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Travels Fleet
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Click on any bus to view all photos and direct contact numbers.
          </p>
        </div>
      </div>

      {/* Buses Grid */}
      {buses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Bus className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            No Buses in Fleet Yet
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Buses added by the administrator will be displayed right here.
          </p>
          {isAdmin && (
            <button
              onClick={onGoToAddBuses}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Bus</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {buses.map((bus) => {
            const photoCount = bus.photos?.length || 1;
            return (
              <div
                key={bus.id}
                onClick={() => handleOpenBus(bus)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
              >
                {/* Bus Photo */}
                <div className="relative h-56 sm:h-64 bg-slate-100 overflow-hidden">
                  <img
                    src={bus.photoUrl}
                    alt={bus.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Multiple photos count tag */}
                  {photoCount > 1 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white rounded-lg text-xs font-semibold shadow-md">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{photoCount} Photos</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-base sm:text-lg font-bold drop-shadow-md line-clamp-1">
                      {bus.name}
                    </h3>
                    <span className="text-[11px] text-blue-200 font-medium">
                      Click to view all photos &amp; contact
                    </span>
                  </div>
                </div>

                {/* Footer bar */}
                <div className="p-4 flex items-center justify-between gap-2 bg-white">
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                    <Bus className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="line-clamp-1">{bus.name}</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    View &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bus Details & Photos Modal with Contact Us */}
      {selectedBus && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto"
          onClick={() => setSelectedBus(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight">
                    {selectedBus.name}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    KBR Holidays Fleet
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedBus(null)}
                aria-label="Close"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              {/* Photo Showcase Carousel */}
              <div>
                <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center shadow-inner">
                  <img
                    src={busPhotos[activePhotoIndex]}
                    alt={`${selectedBus.name} - Photo ${activePhotoIndex + 1}`}
                    className="w-full h-full object-contain sm:object-cover"
                  />

                  {/* Left / Right arrows if multiple photos */}
                  {busPhotos.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevPhoto}
                        aria-label="Previous photo"
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full shadow-lg transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        onClick={handleNextPhoto}
                        aria-label="Next photo"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full shadow-lg transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Photo counter */}
                      <div className="absolute bottom-3 right-3 px-3 py-1 bg-slate-900/80 backdrop-blur-xs text-white rounded-full text-xs font-bold">
                        {activePhotoIndex + 1} / {busPhotos.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail strip if multiple photos */}
                {busPhotos.length > 1 && (
                  <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                    {busPhotos.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIndex(idx)}
                        className={`relative rounded-xl overflow-hidden shrink-0 w-16 h-16 sm:w-20 sm:h-20 border-2 transition-all cursor-pointer ${
                          activePhotoIndex === idx
                            ? 'border-blue-600 ring-2 ring-blue-300'
                            : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Booking Dates Button Above Contact Us */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenBookingDates && selectedBus) {
                    onOpenBookingDates(selectedBus);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                <span>Booking Dates</span>
              </button>

              {/* Compact Contact Us Section */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="text-center mb-2">
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-800">
                    Contact Us for Bookings
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Number 1: 7812841999 */}
                  <div className="bg-white rounded-lg p-2 sm:p-2.5 border border-slate-200 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        1. Contact Number
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900 font-mono tracking-wide">
                        7812841999
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy('7812841999')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        copiedNumber === '7812841999'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {copiedNumber === '7812841999' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Number 2: 9025022792 */}
                  <div className="bg-white rounded-lg p-2 sm:p-2.5 border border-slate-200 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        2. Contact Number
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900 font-mono tracking-wide">
                        9025022792
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy('9025022792')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        copiedNumber === '9025022792'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {copiedNumber === '9025022792' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelsPage;
