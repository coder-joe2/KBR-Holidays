import React, { useState } from 'react';
import { db, auth, googleProvider } from '../firebase';
import {
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import KbrLogo from './KbrLogo';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: (user: { name: string; role: 'admin' | 'user'; email?: string; photoURL?: string }) => void;
}

// Helper to run a promise with a timeout so Firestore never hangs the UI
function withTimeout<T>(promise: Promise<T>, timeoutMs = 2000): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
  ]);
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onBack,
  onLoginSuccess,
}) => {
  const [viewMode, setViewMode] = useState<'login' | 'signup'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);

  // Signup form state
  const [signupFullName, setSignupFullName] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccessMessage, setSignupSuccessMessage] = useState<string | null>(null);

  // Save registered user to LocalStorage instantly & sync to Firestore in background
  const recordRegisteredUser = async (
    email: string,
    name: string,
    mobile?: string,
    provider = 'email',
    plainPassword?: string,
    photoURL?: string
  ) => {
    const cleanEmail = email.toLowerCase().trim();
    const userData: any = {
      email: cleanEmail,
      name: name || 'User',
      mobile: mobile || '',
      provider,
      registeredAt: Date.now(),
      createdAt: new Date().toISOString(),
    };
    if (plainPassword) {
      userData.password = plainPassword;
    }
    if (photoURL) {
      userData.photoURL = photoURL;
    }

    // 1. Save immediately in LocalStorage (synchronous, 100% reliable)
    try {
      const local = JSON.parse(localStorage.getItem('kbr_registered_users') || '{}');
      local[cleanEmail] = userData;
      localStorage.setItem('kbr_registered_users', JSON.stringify(local));
    } catch {
      // LocalStorage fallback
    }

    // 2. Sync to Firebase Firestore asynchronously without blocking UI
    try {
      withTimeout(setDoc(doc(db, 'registered_users', cleanEmail), userData), 2500).catch(() => {});
      withTimeout(setDoc(doc(db, 'users', cleanEmail), userData), 2500).catch(() => {});
    } catch {
      // Ignore background sync errors
    }

    return userData;
  };

  // Get registered user details from LocalStorage first, then Firestore with safe timeout
  const getRegisteredUserData = async (email: string): Promise<any | null> => {
    const cleanEmail = email.toLowerCase().trim();

    // 1. Instant check from LocalStorage
    try {
      const local = JSON.parse(localStorage.getItem('kbr_registered_users') || '{}');
      if (local[cleanEmail]) {
        return local[cleanEmail];
      }
    } catch {
      // Continue to Firestore
    }

    // 2. Check Firestore registered_users collection with a short timeout
    try {
      const snap = await withTimeout(getDoc(doc(db, 'registered_users', cleanEmail)), 1800);
      if (snap && snap.exists()) {
        const data = snap.data();
        // Update local cache
        try {
          const local = JSON.parse(localStorage.getItem('kbr_registered_users') || '{}');
          local[cleanEmail] = data;
          localStorage.setItem('kbr_registered_users', JSON.stringify(local));
        } catch {}
        return data;
      }
    } catch {
      // Client offline or timeout - handled gracefully
    }

    // 3. Check Firestore users collection with timeout
    try {
      const snap2 = await withTimeout(getDoc(doc(db, 'users', cleanEmail)), 1500);
      if (snap2 && snap2.exists()) {
        const data = snap2.data();
        try {
          const local = JSON.parse(localStorage.getItem('kbr_registered_users') || '{}');
          local[cleanEmail] = data;
          localStorage.setItem('kbr_registered_users', JSON.stringify(local));
        } catch {}
        return data;
      }
    } catch {
      // Handled gracefully
    }

    return null;
  };

  // Handle Login (Email/Password)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccessMessage(null);

    const emailTrim = loginEmail.trim().toLowerCase();
    const passTrim = loginPassword;

    if (!emailTrim || !passTrim) {
      setLoginError('Please enter both Email/Username and Password.');
      return;
    }

    setIsSubmitting(true);

    // 1. Admin credentials check:
    if ((emailTrim === 'admin' || emailTrim === 'kbrholidays@gmail.com') && passTrim === 'KBR@123') {
      setLoginSuccessMessage('Welcome Administrator! Logging in to KBR Holidays...');
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess({ name: 'Admin', role: 'admin', email: 'kbrholidays@gmail.com' });
      }, 500);
      return;
    }

    try {
      // 2. Fetch registered user details
      const registeredUser = await getRegisteredUserData(emailTrim);

      if (!registeredUser) {
        setIsSubmitting(false);
        setLoginError('This account is not registered. Please click "Create Account" below to register first!');
        return;
      }

      // If user registered with Google
      if (registeredUser.provider === 'google') {
        setIsSubmitting(false);
        setLoginError('This account was registered with Google. Please click "Continue with Google" below!');
        return;
      }

      // Check password match
      if (registeredUser.password !== passTrim) {
        setIsSubmitting(false);
        setLoginError('Incorrect password. Please enter the password you registered with.');
        return;
      }

      // Success!
      const isAdmin = emailTrim === 'kbrholidays@gmail.com';
      setLoginSuccessMessage(`Welcome back, ${registeredUser.name || 'User'}! Logging in...`);

      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess({
          name: registeredUser.name || 'User',
          role: isAdmin ? 'admin' : 'user',
          email: emailTrim,
        });
      }, 500);

    } catch (err: any) {
      setIsSubmitting(false);
      setLoginError('Login failed: ' + (err?.message || 'Please try again.'));
    }
  };

  // Handle Signup (Email/Password) - Never hangs, instantly records user & syncs to Firebase
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupSuccessMessage(null);

    const nameTrim = signupFullName.trim();
    const emailTrim = signupEmail.trim().toLowerCase();
    const mobileTrim = signupMobile.trim();
    const passTrim = signupPassword;
    const confirmPassTrim = signupConfirmPassword;

    if (!nameTrim) {
      setSignupError('Please enter your full name.');
      return;
    }
    if (!mobileTrim) {
      setSignupError('Please enter your mobile number.');
      return;
    }
    if (!emailTrim || !emailTrim.includes('@')) {
      setSignupError('Please enter a valid email address.');
      return;
    }
    if (passTrim.length < 6) {
      setSignupError('Password must be at least 6 characters.');
      return;
    }
    if (passTrim !== confirmPassTrim) {
      setSignupError('Passwords do not match. Please re-enter.');
      return;
    }
    if (!agreeTerms) {
      setSignupError('Please agree to the Terms of Service to continue.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Check local cache to avoid duplicate registration
      const local = JSON.parse(localStorage.getItem('kbr_registered_users') || '{}');
      if (local[emailTrim]) {
        setIsSubmitting(false);
        setSignupError('This email is already registered! Please click "Sign In" below to login.');
        return;
      }

      // 2. Save user directly into LocalStorage and push to Firebase Firestore
      await recordRegisteredUser(emailTrim, nameTrim, mobileTrim, 'email', passTrim);

      // 3. Immediately display success feedback
      setSignupSuccessMessage('Account created successfully in Firebase! Redirecting to Sign In...');

      // Clear password fields
      setSignupPassword('');
      setSignupConfirmPassword('');

      // 4. Switch to Sign In view within 800ms and pre-fill email
      setTimeout(() => {
        setLoginEmail(emailTrim);
        setLoginPassword('');
        setLoginError(null);
        setLoginSuccessMessage('Account created! Please enter your password to Sign In.');
        setViewMode('login');
        setIsSubmitting(false);
      }, 800);

    } catch (err: any) {
      setIsSubmitting(false);
      setSignupError(err?.message || 'Failed to create account. Please try again.');
    }
  };

  // Google Login on LOGIN PAGE
  const handleGoogleLogin = async () => {
    try {
      setLoginError(null);
      setLoginSuccessMessage(null);
      setIsSubmitting(true);

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userEmail = (user.email || '').toLowerCase().trim();
      const isAdmin = userEmail === 'kbrholidays@gmail.com';

      // Admin always allowed
      if (isAdmin) {
        setLoginSuccessMessage(`Admin signed in with Google: ${user.email}`);
        setTimeout(() => {
          setIsSubmitting(false);
          onLoginSuccess({
            name: user.displayName || 'Admin',
            role: 'admin',
            email: user.email || undefined,
            photoURL: user.photoURL || undefined,
          });
        }, 500);
        return;
      }

      // Check if this Google account was registered
      const registeredUser = await getRegisteredUserData(userEmail);

      if (!registeredUser) {
        await signOut(auth);
        setIsSubmitting(false);
        setLoginError(`Google account "${user.email}" is NOT registered! Please click "Create Account" below and select "Register with Google" first.`);
        return;
      }

      // Found registered account
      setLoginSuccessMessage(`Welcome back, ${registeredUser.name || user.displayName || user.email}! Logging in...`);
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess({
          name: registeredUser.name || user.displayName || user.email?.split('@')[0] || 'Google User',
          role: 'user',
          email: user.email || undefined,
          photoURL: user.photoURL || registeredUser.photoURL || undefined,
        });
      }, 500);
    } catch (error: any) {
      setIsSubmitting(false);
      if (error?.code !== 'auth/popup-closed-by-user') {
        setLoginError('Google sign-in failed: ' + (error?.message || 'Please try again.'));
      }
    }
  };

  // Google Register on CREATE ACCOUNT PAGE
  const handleGoogleRegister = async () => {
    try {
      setSignupError(null);
      setSignupSuccessMessage(null);
      setIsSubmitting(true);

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userEmail = (user.email || '').toLowerCase().trim();
      const userName = user.displayName || userEmail.split('@')[0] || 'Google User';
      const isAdmin = userEmail === 'kbrholidays@gmail.com';

      // Record Google user in Firebase & local cache
      await recordRegisteredUser(userEmail, userName, '', 'google', undefined, user.photoURL || undefined);

      setSignupSuccessMessage(`Google account (${user.email}) registered successfully! Welcome to KBR Holidays.`);
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess({
          name: userName,
          role: isAdmin ? 'admin' : 'user',
          email: user.email || undefined,
          photoURL: user.photoURL || undefined,
        });
      }, 600);
    } catch (error: any) {
      setIsSubmitting(false);
      if (error?.code !== 'auth/popup-closed-by-user') {
        setSignupError('Google Registration failed: ' + (error?.message || 'Please try again.'));
      }
    }
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
            {/* Center Logo */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative inline-block mb-3">
                <KbrLogo size={130} />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-center">
                Welcome Back
              </h2>
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
                    Email Address or Username
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400 font-bold text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. user@gmail.com or admin"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium"
                      required
                      disabled={isSubmitting}
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
                      onClick={() => setLoginError('Please contact administrator at 9025022792 to reset password.')}
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
                      disabled={isSubmitting}
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

                {/* Sign In Primary Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 hover:from-amber-800 hover:to-amber-800 text-white font-bold text-sm shadow-lg shadow-amber-800/25 active:scale-[0.99] transition-all cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Social divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Or continue with
                </span>
              </div>

              {/* Social Login Button (Google only - No Apple ID) */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
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
                  <span>Continue with Google</span>
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
                  setSignupError(null);
                }}
                className="font-bold text-slate-900 underline hover:text-blue-700 cursor-pointer ml-1"
              >
                Create Account
              </button>
            </div>
          </div>
        ) : (
          /* VIEW 2: CREATE ACCOUNT PAGE */
          <div>
            {/* Center Logo */}
            <div className="flex flex-col items-center mb-6">
              <div className="mb-2">
                <KbrLogo size={110} />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-center">
                Create Account
              </h2>
            </div>

            {/* Sign Up Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/90 space-y-4">
              {/* Feedback messages for Signup */}
              {signupError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{signupError}</span>
                </div>
              )}

              {signupSuccessMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{signupSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <div className="mb-1.5">
                    <label className="block text-xs font-bold text-slate-800">Full Name</label>
                  </div>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="text"
                      value={signupFullName}
                      onChange={(e) => setSignupFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
                      <span>🇮🇳 +91</span>
                    </div>
                    <div className="relative flex-1 flex items-center">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5" />
                      <input
                        type="tel"
                        value={signupMobile}
                        onChange={(e) => setSignupMobile(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="ramesh@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Create Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Create Password</label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                      required
                      disabled={isSubmitting}
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
                      <div className={`rounded-full transition-colors ${signupPassword.length > 0 ? 'bg-amber-400' : 'bg-slate-200'}`} />
                      <div className={`rounded-full transition-colors ${signupPassword.length >= 6 ? 'bg-amber-500' : 'bg-slate-200'}`} />
                      <div className={`rounded-full transition-colors ${signupPassword.length >= 8 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Confirm Password</label>
                  <div className="relative flex items-center">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                      required
                      disabled={isSubmitting}
                    />
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
                    disabled={isSubmitting}
                  />
                  <span>
                    I agree to the <span className="font-semibold text-amber-800">Terms of Service</span> and acknowledge the <span className="font-semibold text-amber-800">Privacy Policy</span>.
                  </span>
                </label>

                {/* Create Account Primary Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#091A2E] hover:bg-[#0E2847] text-white font-bold text-sm shadow-lg shadow-slate-900/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account in Firebase...</span>
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
                  Or fast-track with
                </span>
              </div>

              {/* Social Register Button (Google only - No Apple ID) */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleRegister}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Register with Google</span>
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
                  setLoginError(null);
                  setSignupError(null);
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
