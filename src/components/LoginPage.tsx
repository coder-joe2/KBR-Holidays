import React, { useState } from 'react';
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Mail,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
} from 'lucide-react';
import KbrLogo from './KbrLogo';
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from '../firebase';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: (user: { name: string; role: 'admin' | 'user' }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onBack,
  onLoginSuccess,
}) => {
  const [viewMode, setViewMode] = useState<'login' | 'signup'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Signup form state (Only Email and Password as requested)
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccessMessage, setSignupSuccessMessage] = useState<string | null>(null);
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  // Handle Login with Firebase & Admin fallback
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccessMessage(null);

    const emailTrim = loginEmail.trim();
    const passTrim = loginPassword.trim();

    if (!emailTrim || !passTrim) {
      setLoginError('Please enter both Email/Username and Password.');
      return;
    }

    // Admin Credentials validation as specified:
    // Email id: "Admin", password: "KBR@123"
    if (emailTrim.toLowerCase() === 'admin' && passTrim === 'KBR@123') {
      setLoginSuccessMessage('Welcome Administrator! Logging in to KBR Holidays...');
      setTimeout(() => {
        onLoginSuccess({ name: 'Admin', role: 'admin' });
      }, 600);
      return;
    }

    setIsLoginLoading(true);

    try {
      // Real Firebase Email/Password Sign-In
      const userCredential = await signInWithEmailAndPassword(auth, emailTrim, passTrim);
      const user = userCredential.user;
      const displayName = user.displayName || user.email?.split('@')[0] || 'User';
      setLoginSuccessMessage(`Welcome back, ${displayName}! Logging in...`);
      setTimeout(() => {
        onLoginSuccess({ name: displayName, role: 'user' });
      }, 600);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setLoginError('Invalid email or password. If you do not have an account, please click "Create Account".');
      } else if (code === 'auth/invalid-email') {
        setLoginError('Please enter a valid email address.');
      } else if (code === 'auth/too-many-requests') {
        setLoginError('Too many failed attempts. Please try again later or reset password.');
      } else {
        setLoginError(err?.message || 'Failed to sign in. Please check your credentials.');
      }
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Handle Signup with Firebase (Only Email & Password)
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupSuccessMessage(null);

    const emailTrim = signupEmail.trim();
    const passTrim = signupPassword;

    if (!emailTrim || !passTrim) {
      setSignupError('Please provide both Email and Password.');
      return;
    }

    if (passTrim.length < 6) {
      setSignupError('Password must be at least 6 characters.');
      return;
    }

    if (!agreeTerms) {
      setSignupError('Please agree to the Terms of Service to continue.');
      return;
    }

    setIsSignupLoading(true);

    try {
      // Real Firebase Email/Password Account Creation
      const userCredential = await createUserWithEmailAndPassword(auth, emailTrim, passTrim);
      const user = userCredential.user;
      const displayName = user.email?.split('@')[0] || 'User';
      setSignupSuccessMessage('Account created successfully! Welcome to KBR Holidays.');
      setTimeout(() => {
        onLoginSuccess({ name: displayName, role: 'user' });
      }, 600);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        setSignupError('This email is already registered. Please sign in instead.');
      } else if (code === 'auth/invalid-email') {
        setSignupError('Please enter a valid email address.');
      } else if (code === 'auth/weak-password') {
        setSignupError('Password is too weak. Please use at least 6 characters.');
      } else {
        setSignupError(err?.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsSignupLoading(false);
    }
  };

  // Google Sign In / Register Handler (Real Firebase Auth Only - No test login)
  const handleGoogleAuth = async () => {
    setLoginError(null);
    setSignupError(null);
    setIsLoginLoading(true);
    setIsSignupLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const displayName = user.displayName || user.email?.split('@')[0] || 'Voyager User';
      setLoginSuccessMessage(`Signed in with Google as ${displayName}`);
      setSignupSuccessMessage(`Registered with Google as ${displayName}`);
      setTimeout(() => {
        onLoginSuccess({ name: displayName, role: 'user' });
      }, 600);
    } catch (err: any) {
      const code = err?.code || '';
      // If user closed popup deliberately, do nothing and do NOT login
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return;
      }

      const errorMessage =
        code === 'auth/unauthorized-domain'
          ? 'Firebase domain unauthorized. Please add this domain in Firebase Console -> Authentication -> Settings -> Authorized domains.'
          : code === 'auth/operation-not-allowed'
          ? 'Google Sign-In is not enabled in Firebase Console. Please enable Google in Firebase Authentication -> Sign-in method.'
          : err?.message || 'Google authentication failed. Please try again.';

      if (viewMode === 'login') {
        setLoginError(errorMessage);
      } else {
        setSignupError(errorMessage);
      }
    } finally {
      setIsLoginLoading(false);
      setIsSignupLoading(false);
    }
  };

  // Quick fill Admin helper for demonstration
  const handleQuickFillAdmin = () => {
    setLoginEmail('Admin');
    setLoginPassword('KBR@123');
    setLoginError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-100 flex flex-col justify-between text-slate-800">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          aria-label="Back"
          className="p-2 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          {viewMode === 'login' ? 'Login' : 'Create Account'}
        </h1>

        <div className="w-8 h-8 flex items-center justify-center">
          <KbrLogo size={28} />
        </div>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-md mx-auto px-4 py-6 sm:py-8 flex-1 flex flex-col justify-center">
        {/* VIEW 1: LOGIN PAGE */}
        {viewMode === 'login' ? (
          <div>
            {/* Center Logo with Gold Ring & Star Badge */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative inline-block mb-3">
                <KbrLogo size={130} />
                {/* Small star badge at bottom right */}
                <div className="absolute bottom-1 right-2 w-7 h-7 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-center">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 text-center mt-1">
                Sign in to continue your luxury journey
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/90">
              {/* Feedback messages */}
              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {loginSuccessMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{loginSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email / Username */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Email or Username
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400 font-bold text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. rohan.sharma@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Please contact administrator at 9025022792 to reset.')}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your security password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Secure Session */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                    />
                    <span>Remember my device</span>
                  </label>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Secure Session</span>
                  </div>
                </div>

                {/* Sign In Primary Button */}
                <button
                  type="submit"
                  disabled={isLoginLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 hover:from-amber-800 hover:to-amber-800 text-white font-bold text-sm shadow-lg shadow-amber-800/25 active:scale-[0.99] transition-all cursor-pointer mt-2 disabled:opacity-70"
                >
                  {isLoginLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>SignIn</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Admin helper pill for quick fill */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Admin Login credentials:</span>
                <button
                  type="button"
                  onClick={handleQuickFillAdmin}
                  className="text-amber-700 font-bold hover:underline cursor-pointer bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200"
                >
                  Fill Admin (Admin / KBR@123)
                </button>
              </div>

              {/* Social fast track divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Or continue with
                </span>
              </div>

              {/* Only Google Button (Apple button removed as circled) */}
              <div>
                <button
                  type="button"
                  disabled={isLoginLoading}
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-slate-50 active:scale-[0.99] border border-slate-200 hover:border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-all cursor-pointer disabled:opacity-60"
                >
                  {isLoginLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>{isLoginLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
                </button>
              </div>
            </div>

            {/* Switch to Create Account */}
            <div className="text-center mt-6 text-xs text-slate-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setViewMode('signup');
                  setLoginError(null);
                  setLoginSuccessMessage(null);
                }}
                className="font-bold text-slate-900 underline hover:text-blue-700 cursor-pointer ml-1"
              >
                Create Account
              </button>
            </div>
          </div>
        ) : (
          /* VIEW 2: CREATE ACCOUNT PAGE (Only Email and Password + Google Register) */
          <div>
            {/* Center Logo */}
            <div className="flex flex-col items-center mb-6">
              <div className="mb-2">
                <KbrLogo size={110} />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/70 border border-amber-300/80 text-amber-900 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>First-Class Voyage Club</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-center">
                Create Account
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 text-center mt-1 max-w-xs">
                Join KBR Holidays for an unmatched travel experience across scenic routes.
              </p>
            </div>

            {/* Sign Up Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/90 space-y-4">
              {/* Feedback messages */}
              {signupError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{signupError}</span>
                </div>
              )}

              {signupSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{signupSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                {/* 1. Email Address Only */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="alexander@prestige.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                {/* 2. Password Only */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Security Level Bars */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-semibold mb-1">
                      <span>Security Level:</span>
                      <span>{signupPassword.length >= 8 ? 'STRONG' : signupPassword.length >= 6 ? 'GOOD' : 'AWAITING INPUT'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 h-1.5">
                      <div className={`rounded-full ${signupPassword.length > 0 ? 'bg-amber-400' : 'bg-slate-200'}`} />
                      <div className={`rounded-full ${signupPassword.length >= 6 ? 'bg-amber-500' : 'bg-slate-200'}`} />
                      <div className={`rounded-full ${signupPassword.length >= 8 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    </div>
                  </div>
                </div>

                {/* Terms agreement */}
                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    required
                  />
                  <span>
                    I agree to the <span className="font-semibold text-amber-800">Terms of Service</span> and acknowledge the <span className="font-semibold text-amber-800">Privacy Policy</span>.
                  </span>
                </label>

                {/* Create Account Primary Button (Email with password) */}
                <button
                  type="submit"
                  disabled={isSignupLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#091A2E] hover:bg-[#0E2847] text-white font-bold text-sm shadow-lg shadow-slate-900/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-70"
                >
                  {isSignupLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Fast Track divider */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Or register with
                </span>
              </div>

              {/* Google with Register (Apple ID removed as circled) */}
              <div>
                <button
                  type="button"
                  disabled={isSignupLoading}
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-slate-50 active:scale-[0.99] border border-slate-200 hover:border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSignupLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>{isSignupLoading ? 'Connecting to Google...' : 'Register with Google'}</span>
                </button>
              </div>
            </div>

            {/* Switch to Sign In */}
            <div className="text-center mt-6 text-xs text-slate-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setViewMode('login');
                  setSignupError(null);
                  setSignupSuccessMessage(null);
                }}
                className="font-bold text-slate-900 underline hover:text-amber-800 cursor-pointer ml-1"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
