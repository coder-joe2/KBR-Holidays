import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Printer,
  Calendar as CalendarIcon,
} from 'lucide-react';

interface WallCalendarProps {
  onContactClick?: () => void;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS_OF_WEEK = [
  { label: 'Sun', isWeekend: true },
  { label: 'Mon', isWeekend: false },
  { label: 'Tue', isWeekend: false },
  { label: 'Wed', isWeekend: false },
  { label: 'Thu', isWeekend: false },
  { label: 'Fri', isWeekend: false },
  { label: 'Sat', isWeekend: true },
];

export const WallCalendar: React.FC<WallCalendarProps> = () => {
  // Real live current date
  const today = new Date();
  const currentDayNumber = today.getDate();
  const currentMonthIndex = today.getMonth();
  const currentYearNumber = today.getFullYear();

  // Selected viewing month and year
  const [viewDate, setViewDate] = useState<Date>(
    new Date(currentYearNumber, currentMonthIndex, 1)
  );

  const viewMonth = viewDate.getMonth();
  const viewYear = viewDate.getFullYear();

  // Navigation handlers
  const handlePrevMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleJumpToToday = () => {
    setViewDate(new Date(currentYearNumber, currentMonthIndex, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    setViewDate(new Date(newYear, viewMonth, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10);
    setViewDate(new Date(viewYear, newMonth, 1));
  };

  // Calendar calculations
  // Day of week of the 1st day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  // Total days in the current viewing month
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Grid slots: we need 5 or 6 rows (35 or 42 cells)
  const totalSlotsNeeded = firstDayOfWeek + daysInMonth;
  const totalGridCells = totalSlotsNeeded > 35 ? 42 : 35;

  // Header formatted string like reference image: "January-2014"
  const formattedHeaderMonthYear = `${MONTH_NAMES[viewMonth]}-${viewYear}`;

  const isCurrentViewingMonth =
    viewYear === currentYearNumber && viewMonth === currentMonthIndex;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Top Browser / Calendar Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-md">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-amber-400" />
          <span className="font-semibold text-sm sm:text-base tracking-wide">
            KBR Holidays Wall Calendar
          </span>
        </div>

        {/* Navigation Controls: Prev, Today, Next */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handlePrevMonth}
            aria-label="Previous Month"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs sm:text-sm font-medium rounded-lg transition-all border border-slate-700 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={handleJumpToToday}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              isCurrentViewingMonth
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Today</span>
          </button>

          <button
            onClick={handleNextMonth}
            aria-label="Next Month"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs sm:text-sm font-medium rounded-lg transition-all border border-slate-700 cursor-pointer"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Quick Selectors */}
          <div className="hidden md:flex items-center gap-2 ml-2 border-l border-slate-700 pl-2">
            <select
              value={viewMonth}
              onChange={handleMonthChange}
              className="bg-slate-800 text-slate-100 text-xs rounded-md px-2 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={name} value={idx}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={viewYear}
              onChange={handleYearChange}
              className="bg-slate-800 text-slate-100 text-xs rounded-md px-2 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {Array.from({ length: 15 }, (_, i) => currentYearNumber - 5 + i).map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrint}
            title="Print Calendar"
            className="hidden sm:flex items-center gap-1 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Wall Calendar Card - Authentic Spreadsheet / Wall Calendar Styling */}
      <div className="bg-white rounded-xl shadow-xl border border-slate-300 overflow-hidden print:shadow-none print:border-none">
        {/* Blue Header Banner matching Spreadsheet123 template in image.png */}
        <div className="bg-[#2B579A] text-white px-4 py-3 sm:py-3.5 text-center relative border-b-2 border-[#1E3F70]">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight select-none">
            {formattedHeaderMonthYear}
          </h2>
          {isCurrentViewingMonth && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] sm:text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
              Current Month
            </span>
          )}
        </div>

        {/* Days of Week Header Row: Sun, Mon, Tue, Wed, Thu, Fri, Sat */}
        <div className="grid grid-cols-7 border-b border-slate-300 bg-slate-50 text-center select-none">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day.label}
              className={`py-2 sm:py-2.5 text-xs sm:text-sm md:text-base font-bold border-r last:border-r-0 border-slate-300 ${
                day.isWeekend ? 'text-[#D32F2F]' : 'text-slate-900'
              }`}
            >
              {day.label}
            </div>
          ))}
        </div>

        {/* Calendar Days 7-Column Grid */}
        <div className="grid grid-cols-7 border-collapse bg-white">
          {Array.from({ length: totalGridCells }).map((_, index) => {
            const dayNumber = index - firstDayOfWeek + 1;
            const isDayInCurrentMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
            const dayOfWeekColumn = index % 7;
            const isWeekend = dayOfWeekColumn === 0 || dayOfWeekColumn === 6;

            const isToday =
              isCurrentViewingMonth && isDayInCurrentMonth && dayNumber === currentDayNumber;

            return (
              <div
                key={index}
                className={`relative flex items-center justify-center p-2 sm:p-3 md:p-4 min-h-[68px] sm:min-h-[85px] md:min-h-[105px] border-r border-b border-slate-300 transition-colors ${
                  (index + 1) % 7 === 0 ? 'border-r-0' : ''
                } ${
                  !isDayInCurrentMonth
                    ? 'bg-slate-50/50'
                    : isToday
                    ? 'bg-blue-50/70'
                    : 'hover:bg-slate-50/80'
                }`}
              >
                {isDayInCurrentMonth && (
                  <div
                    className={`flex flex-col items-center justify-center transition-transform ${
                      isToday
                        ? 'w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-blue-600 text-white shadow-lg ring-4 ring-blue-300/70 scale-105'
                        : ''
                    }`}
                  >
                    <span
                      className={`tabular-nums leading-none select-none ${
                        isToday
                          ? 'text-xl sm:text-2xl md:text-3xl font-black text-white'
                          : isWeekend
                          ? 'text-xl sm:text-2xl md:text-3xl font-extrabold text-[#D32F2F]'
                          : 'text-xl sm:text-2xl md:text-3xl font-bold text-slate-900'
                      }`}
                    >
                      {dayNumber}
                    </span>

                    {/* Today label for the marked blue date */}
                    {isToday && (
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-blue-100 mt-0.5 sm:mt-1">
                        Today
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Wall Calendar Template Footer matching image style */}
        <div className="flex flex-wrap items-center justify-between text-[11px] sm:text-xs text-slate-500 px-4 py-2.5 bg-slate-50 border-t border-slate-200">
          <span className="font-medium text-slate-700">
            KBR Holidays · Monthly Wall Calendar
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              <span>Current Day</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D32F2F] inline-block" />
              <span>Weekend (Sun / Sat)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallCalendar;
