import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Printer,
  Calendar as CalendarIcon,
  ArrowLeft,
  CheckCircle2,
  Lock,
  X,
  ExternalLink,
} from 'lucide-react';

interface WallCalendarProps {
  busName?: string;
  bookedDates?: string[]; // Array of 'YYYY-MM-DD'
  isAdminMode?: boolean; // If true, Admin can click any date to toggle booking!
  onToggleDateBooking?: (dateStr: string) => void;
  onBack?: () => void;
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

export const WallCalendar: React.FC<WallCalendarProps> = ({
  busName,
  bookedDates = [],
  isAdminMode = false,
  onToggleDateBooking,
  onBack,
}) => {
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
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const totalSlotsNeeded = firstDayOfWeek + daysInMonth;
  const totalGridCells = totalSlotsNeeded > 35 ? 42 : 35;

  const formattedHeaderMonthYear = `${MONTH_NAMES[viewMonth]}-${viewYear}`;
  const isCurrentViewingMonth =
    viewYear === currentYearNumber && viewMonth === currentMonthIndex;

  // Check if viewing month is strictly before Today's month (past month)
  const isPastMonth =
    viewYear < currentYearNumber ||
    (viewYear === currentYearNumber && viewMonth < currentMonthIndex);

  // Group and sort all upcoming/future months that have booked dates
  // Mentions month names (e.g. October 2026, November 2026, January 2027)
  const allUpcomingBookedMonths = useMemo(() => {
    const monthMap = new Map<
      string,
      { year: number; monthIndex: number; count: number; dates: string[] }
    >();

    bookedDates.forEach((dateStr) => {
      const parts = dateStr.split('-');
      if (parts.length >= 2) {
        const yr = parseInt(parts[0], 10);
        const mo = parseInt(parts[1], 10) - 1; // 0-indexed month
        if (!isNaN(yr) && !isNaN(mo)) {
          // Never include past months strictly before today's month for regular users
          const isBeforeCurrentMonth =
            yr < currentYearNumber || (yr === currentYearNumber && mo < currentMonthIndex);
          if (!isBeforeCurrentMonth || isAdminMode) {
            const key = `${yr}-${mo}`;
            const existing = monthMap.get(key) || {
              year: yr,
              monthIndex: mo,
              count: 0,
              dates: [],
            };
            existing.count += 1;
            existing.dates.push(dateStr);
            monthMap.set(key, existing);
          }
        }
      }
    });

    return Array.from(monthMap.values())
      .map((item) => ({
        ...item,
        dates: item.dates.sort(),
      }))
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.monthIndex - b.monthIndex;
      });
  }, [bookedDates, currentYearNumber, currentMonthIndex, isAdminMode]);

  // Modal to show all booking dates when clicking "..." button
  const [showAllDatesModal, setShowAllDatesModal] = useState<boolean>(false);

  // Requirement: Dynamically show booked months relative to currently viewed month.
  // 1. Viewing October -> shows October and next booking month (e.g. November or January), remaining in "..." button
  // 2. Switching to November -> shows November and next booking month (e.g. January)
  // 3. If on last booking month and no next booking month -> only 1 single booking month is displayed!
  const bookedMonthsFromView = useMemo(() => {
    return allUpcomingBookedMonths.filter((m) => {
      const refYear = !isAdminMode && isPastMonth ? currentYearNumber : viewYear;
      const refMonth = !isAdminMode && isPastMonth ? currentMonthIndex : viewMonth;
      return m.year > refYear || (m.year === refYear && m.monthIndex >= refMonth);
    });
  }, [
    allUpcomingBookedMonths,
    viewYear,
    viewMonth,
    isPastMonth,
    currentYearNumber,
    currentMonthIndex,
    isAdminMode,
  ]);

  // Up to next 2 booked months from the currently viewed month
  const visibleUpcomingMonths = bookedMonthsFromView.slice(0, 2);
  // Whether there are more booked months after the second visible month
  const hasMoreMonths = bookedMonthsFromView.length > 2;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Top Banner with back button & bus name */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-md">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Back"
              className="p-1.5 -ml-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-400" />
            <div>
              <span className="font-bold text-sm sm:text-base tracking-wide block">
                {busName ? `${busName} · Calendar` : 'KBR Holidays Wall Calendar'}
              </span>
              {isAdminMode && (
                <span className="text-[11px] text-amber-400 font-semibold block">
                  Admin Mode: Click any date to mark/unmark as Booked
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Clean Navigation Controls: Prev, Today, Next */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
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

      {/* Main Wall Calendar Card */}
      <div className="bg-white rounded-xl shadow-xl border border-slate-300 overflow-hidden print:shadow-none print:border-none">
        {/* Clean Blue Header Banner */}
        <div className="bg-[#2B579A] text-white px-4 py-3 sm:py-3.5 text-center relative border-b-2 border-[#1E3F70]">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight select-none uppercase">
            {formattedHeaderMonthYear}
          </h2>
          {isCurrentViewingMonth && (
            <span className="inline-block text-[10px] sm:text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full font-semibold mt-1">
              Current Month
            </span>
          )}
        </div>

        {/* Upcoming Booked Months Banner - Shows next 2 booked months relative to viewed month, remaining in "..." button */}
        {bookedMonthsFromView.length > 0 && (
          <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                <CalendarIcon className="w-4 h-4 text-rose-600" />
                <span>Upcoming Booked Months:</span>
              </span>
              {visibleUpcomingMonths.map((item) => {
                const isSelected = viewYear === item.year && viewMonth === item.monthIndex;
                const isItemCurrentMonth =
                  item.year === currentYearNumber && item.monthIndex === currentMonthIndex;
                return (
                  <button
                    key={`${item.year}-${item.monthIndex}`}
                    type="button"
                    onClick={() => setViewDate(new Date(item.year, item.monthIndex, 1))}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400'
                        : 'bg-white hover:bg-rose-50 text-slate-800 hover:text-rose-700 border border-slate-300 hover:border-rose-300 shadow-2xs'
                    }`}
                    title={`Click to view ${MONTH_NAMES[item.monthIndex]} ${item.year} (${item.count} dates booked)`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-rose-600'
                      } animate-pulse`}
                    />
                    <span>
                      {MONTH_NAMES[item.monthIndex]} {item.year}
                      {isItemCurrentMonth ? ' (This Month)' : ''}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                        isSelected ? 'bg-rose-800 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.count} {item.count === 1 ? 'date' : 'dates'}
                    </span>
                  </button>
                );
              })}

              {/* The "..." button for remaining months beyond the visible 2 */}
              {hasMoreMonths && (
                <button
                  type="button"
                  onClick={() => setShowAllDatesModal(true)}
                  className="inline-flex items-center justify-center px-3 py-1 bg-white hover:bg-rose-50 active:scale-95 text-slate-800 hover:text-rose-700 font-black text-sm rounded-lg border border-slate-300 hover:border-rose-400 shadow-2xs transition-all cursor-pointer"
                  title="Click to view all booking dates (...)"
                >
                  ...
                </button>
              )}
            </div>
          </div>
        )}

        {/* Notice when regular user views a past month */}
        {!isAdminMode && isPastMonth && (
          <div className="bg-amber-50/90 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-800 font-medium flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Past booking records prior to {MONTH_NAMES[currentMonthIndex]} {currentYearNumber} are hidden for users.</span>
          </div>
        )}

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

            // Date string format: YYYY-MM-DD
            const dateStr = isDayInCurrentMonth
              ? `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
              : '';

            const isBookedInDate = isDayInCurrentMonth && bookedDates.includes(dateStr);
            // Requirement: "Today month ku pinnadi erukkura Booking details la User ku show panna koodadhu"
            // If user is not admin, hide booking details for past months prior to current month
            const isBooked = isBookedInDate && (isAdminMode || !isPastMonth);

            return (
              <div
                key={index}
                onClick={() => {
                  if (isAdminMode && isDayInCurrentMonth && onToggleDateBooking && dateStr) {
                    onToggleDateBooking(dateStr);
                  }
                }}
                className={`relative flex items-center justify-center p-2 sm:p-3 md:p-4 min-h-[68px] sm:min-h-[85px] md:min-h-[105px] border-r border-b border-slate-300 transition-all ${
                  (index + 1) % 7 === 0 ? 'border-r-0' : ''
                } ${
                  !isDayInCurrentMonth
                    ? 'bg-slate-50/50'
                    : isBooked
                    ? 'bg-rose-50/90'
                    : isToday
                    ? 'bg-blue-50/70'
                    : 'hover:bg-slate-50/80'
                } ${
                  isAdminMode && isDayInCurrentMonth
                    ? 'cursor-pointer hover:ring-2 hover:ring-inset hover:ring-amber-400'
                    : ''
                }`}
              >
                {isDayInCurrentMonth && (
                  <div
                    className={`flex flex-col items-center justify-center transition-all ${
                      isBooked
                        ? 'w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-rose-600 text-white shadow-lg ring-4 ring-rose-200 scale-105'
                        : isToday
                        ? 'w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-blue-600 text-white shadow-lg ring-4 ring-blue-300/70 scale-105'
                        : ''
                    }`}
                  >
                    <span
                      className={`tabular-nums leading-none select-none ${
                        isBooked || isToday
                          ? 'text-xl sm:text-2xl md:text-3xl font-black text-white'
                          : isWeekend
                          ? 'text-xl sm:text-2xl md:text-3xl font-extrabold text-[#D32F2F]'
                          : 'text-xl sm:text-2xl md:text-3xl font-bold text-slate-900'
                      }`}
                    >
                      {dayNumber}
                    </span>

                    {/* Booked label */}
                    {isBooked ? (
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-rose-100 mt-0.5">
                        Booked
                      </span>
                    ) : isToday ? (
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-blue-100 mt-0.5 sm:mt-1">
                        Today
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Wall Calendar Template Footer */}
        <div className="flex flex-wrap items-center justify-between text-[11px] sm:text-xs text-slate-500 px-4 py-2.5 bg-slate-50 border-t border-slate-200">
          <span className="font-medium text-slate-700">
            {busName ? `${busName} Booking Schedule` : 'KBR Holidays · Monthly Wall Calendar'}
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              <span>Current Day</span>
            </span>
            {(isAdminMode || !isPastMonth) && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
                <span className="font-semibold text-rose-700">Booked Date</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D32F2F] inline-block" />
              <span>Weekend (Sun / Sat)</span>
            </span>
          </div>
        </div>
      </div>

      {/* All Booking Dates Modal - Opens when clicking "..." button */}
      {showAllDatesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-600/30 flex items-center justify-center text-rose-400 border border-rose-500/40">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-white leading-tight">
                    All Booking Dates
                  </h3>
                  <p className="text-xs text-slate-300">
                    {busName ? `${busName} · ` : ''}Upcoming Schedule
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAllDatesModal(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Grouped by Month */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                <span>
                  Total{' '}
                  <strong className="text-slate-800">
                    {allUpcomingBookedMonths.reduce((acc, m) => acc + m.count, 0)} dates
                  </strong>{' '}
                  booked across {allUpcomingBookedMonths.length} months
                </span>
                <span className="text-[11px] text-slate-400">
                  Click any month or date to navigate
                </span>
              </div>

              {allUpcomingBookedMonths.map((item) => {
                const isCurrentViewing = viewYear === item.year && viewMonth === item.monthIndex;
                return (
                  <div
                    key={`${item.year}-${item.monthIndex}`}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isCurrentViewing
                        ? 'border-rose-300 bg-rose-50/50 ring-1 ring-rose-200'
                        : 'border-slate-200 bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-slate-900">
                          {MONTH_NAMES[item.monthIndex]} {item.year}
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                          {item.count} {item.count === 1 ? 'date' : 'dates'}
                        </span>
                        {isCurrentViewing && (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            Currently Viewing
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setViewDate(new Date(item.year, item.monthIndex, 1));
                          setShowAllDatesModal(false);
                        }}
                        className="text-xs font-bold px-2.5 py-1 bg-white hover:bg-slate-100 active:scale-95 text-slate-700 hover:text-slate-900 rounded-lg border border-slate-300 shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>Open Month</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>

                    {/* Chips of all individual booked dates in this month */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.dates.map((dateStr) => {
                        const [yr, mo, da] = dateStr.split('-').map(Number);
                        const d = new Date(yr, mo - 1, da);
                        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
                        const isWeekend = d.getDay() === 0 || d.getDay() === 6;

                        return (
                          <button
                            key={dateStr}
                            type="button"
                            onClick={() => {
                              setViewDate(new Date(item.year, item.monthIndex, 1));
                              setShowAllDatesModal(false);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-rose-200 hover:border-rose-400 hover:bg-rose-100/60 text-slate-800 text-xs font-medium transition-all shadow-2xs cursor-pointer group"
                            title={`Jump to ${dateStr}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            <span className="font-bold text-slate-900">
                              {MONTH_NAMES[item.monthIndex].slice(0, 3)} {da}
                            </span>
                            <span
                              className={`text-[10px] font-semibold ${
                                isWeekend ? 'text-rose-600' : 'text-slate-500'
                              }`}
                            >
                              ({dayName})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Click any date or month to view on calendar
              </span>
              <button
                type="button"
                onClick={() => setShowAllDatesModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WallCalendar;
