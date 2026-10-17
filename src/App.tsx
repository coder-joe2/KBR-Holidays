import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Phone,
  Instagram,
  Menu,
  X,
  Home as HomeIcon,
  Bus,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import KbrLogo from './components/KbrLogo';
import WallCalendar from './components/WallCalendar';
import ContactBar, { INSTAGRAM_URL, CONTACT_NUMBERS } from './components/ContactBar';
import LoginPage from './components/LoginPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'travels' | 'login'>('home');
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'admin' | 'user' } | null>(null);

  if (activeTab === 'login') {
    return (
      <LoginPage
        onBack={() => setActiveTab('home')}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActiveTab('home');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Top Left: Hamburger Menu & Brand Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Menu"
              className="p-2 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <KbrLogo size={36} className="shrink-0" />
              <div>
                <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                  KBR Holidays
                </span>
                <span className="hidden sm:block text-[11px] text-slate-500 font-medium -mt-0.5">
                  Journey Beyond Dreams
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Tabs: Home, Calendar & Travels (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'home'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'calendar'
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab('travels')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'travels'
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bus className="w-4 h-4" />
              <span>Travels</span>
            </button>
          </nav>

          {/* Quick Contact CTA & Sign In */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {currentUser ? (
              <button
                onClick={() => setCurrentUser(null)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-amber-100/80 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors cursor-pointer"
                title="Click to sign out"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>{currentUser.name}</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-600" />
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={() => setShowContactModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 text-slate-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Slide-out Hamburger Drawer */}
      {isMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <KbrLogo size={32} />
                <div>
                  <div className="font-bold text-slate-900 text-sm leading-tight">
                    KBR Holidays
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Menu
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close Menu"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <nav className="p-4 space-y-1.5 flex-1">
              <button
                onClick={() => {
                  setActiveTab('home');
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                <span>Home</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('calendar');
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'calendar'
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Calendar</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('travels');
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'travels'
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Bus className="w-4 h-4" />
                <span>Travels</span>
              </button>

              <div className="pt-3 pb-1 border-t border-slate-200 my-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4">
                  Quick Actions
                </span>
              </div>

              <button
                onClick={() => {
                  setShowContactModal(true);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Contact Details</span>
              </button>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-pink-50 hover:text-pink-600 transition-all"
              >
                <Instagram className="w-4 h-4 text-pink-500" />
                <span>Instagram Profile</span>
              </a>
            </nav>

            {/* Drawer Footer with Direct Booking Lines & Sign In Button */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs space-y-3">
              <div>
                <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                  Direct Booking Lines
                </div>
                <div className="space-y-1 font-mono text-slate-700 font-medium">
                  {CONTACT_NUMBERS.map((c) => (
                    <a
                      key={c.raw}
                      href={`tel:${c.raw}`}
                      className="block hover:text-blue-600 transition-colors"
                    >
                      {c.display}
                    </a>
                  ))}
                </div>
              </div>

              {/* Sign In / User Status Button at Sidebar Bottom */}
              <div className="pt-2 border-t border-slate-200">
                {currentUser ? (
                  <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {currentUser.name}
                          {currentUser.role === 'admin' ? ' (Admin)' : ''}
                        </div>
                        <div className="text-[10px] text-amber-700 font-medium">Logged In</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentUser(null)}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveTab('login');
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 hover:from-amber-800 hover:to-amber-800 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-amber-900/15 transition-all cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-amber-200" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center">
        {activeTab === 'home' ? (
          /* Empty / Clean Minimal Home as explicitly requested ("Home : Empty ya erukkatu") */
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-16 text-center max-w-3xl mx-auto w-full">
            {/* Admin Badge if logged in as Admin */}
            {currentUser?.role === 'admin' && (
              <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-full text-xs font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Admin Session Active · KBR Holidays</span>
              </div>
            )}

            <div className="mb-6 transform hover:scale-[1.02] transition-transform duration-300">
              <KbrLogo size={290} />
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              KBR Holidays
            </h1>

            <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium italic">
              Journey Beyond Dreams
            </p>

            {/* Business Information Section */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 w-full max-w-lg flex flex-col items-center gap-2 text-center">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                Business
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-wider uppercase">
                TOUR AGENCY
              </span>
              <span className="text-xs sm:text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full">
                Trusted &amp; Verified Travel Partner
              </span>
              <div className="text-xs sm:text-sm font-bold text-slate-800 tracking-wider mt-1">
                COLLEGE || SCHOOL || FAMILY
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5">
                <span>CORPORATE Tours contact </span>
                <span className="font-mono font-bold text-blue-700">
                  <a href="tel:9025022792" className="hover:underline">9025022792</a>
                  {', '}
                  <a href="tel:9080439187" className="hover:underline">9080439187</a>
                  {', '}
                  <a href="tel:8925389065" className="hover:underline">8925389065</a>
                </span>
              </div>
            </div>
          </div>
        ) : activeTab === 'calendar' ? (
          /* Calendar View - strictly matching the wall calendar template */
          <div className="py-4 sm:py-8">
            <WallCalendar onContactClick={() => setShowContactModal(true)} />
          </div>
        ) : (
          /* Travels Page - Empty as explicitly requested ("adhukkulla emptya erukkanu") */
          <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            {/* Pure clean empty page */}
          </div>
        )}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} KBR Holidays. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href={`tel:${CONTACT_NUMBERS[0].raw}`} className="hover:text-slate-800 transition-colors">
              Call Support
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-800 transition-colors"
            >
              @kbr__holidays
            </a>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContactModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setShowContactModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <KbrLogo size={28} />
                <span className="font-bold text-slate-900 text-sm">KBR Holidays Support</span>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <ContactBar />
          </div>
        </div>
      )}
    </div>
  );
}
