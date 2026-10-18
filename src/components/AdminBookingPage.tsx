import React, { useState } from 'react';
import { Bus, Calendar, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { BusItem } from './AddBusesPage';
import WallCalendar from './WallCalendar';

interface AdminBookingPageProps {
  buses: BusItem[];
  busBookings: Record<string, string[]>;
  onToggleDateBooking: (busId: string, dateStr: string) => void;
}

export const AdminBookingPage: React.FC<AdminBookingPageProps> = ({
  buses,
  busBookings,
  onToggleDateBooking,
}) => {
  const [selectedBus, setSelectedBus] = useState<BusItem | null>(null);

  if (selectedBus) {
    const bookedDates = busBookings[selectedBus.id] || [];
    return (
      <WallCalendar
        busName={selectedBus.name}
        bookedDates={bookedDates}
        isAdminMode={true}
        onToggleDateBooking={(dateStr) => onToggleDateBooking(selectedBus.id, dateStr)}
        onBack={() => setSelectedBus(null)}
      />
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-bold mb-2">
          <span>Admin Portal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Bus Booking Allocation
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select a bus to open its calendar and click on dates to mark them as Booked.
        </p>
      </div>

      {/* List of Buses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Select Bus to Allocate Booking ({buses.length})
          </h3>
        </div>

        {buses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
            No buses added yet. Please add buses from the "Add Buses" tab first.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {buses.map((bus) => {
              const bookedCount = (busBookings[bus.id] || []).length;
              return (
                <div
                  key={bus.id}
                  onClick={() => setSelectedBus(bus)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer group"
                >
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={bus.photoUrl}
                      alt={bus.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white rounded-lg text-xs font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{bookedCount} Booked</span>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bus className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-bold text-slate-900 text-sm line-clamp-1">
                        {bus.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-amber-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Allocate</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingPage;
