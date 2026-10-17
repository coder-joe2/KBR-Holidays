import React, { useState } from 'react';
import { Phone, MessageCircle, Instagram, Check, Copy } from 'lucide-react';

export const CONTACT_NUMBERS = [
  { raw: '9025022792', display: '+91 90250 22792' },
  { raw: '9080439187', display: '+91 90804 39187' },
  { raw: '8925389065', display: '+91 89253 89065' },
];

export const INSTAGRAM_URL =
  'https://www.instagram.com/kbr__holidays?utm_source=ig_web_button_share_sheet&exln=ZDNlZDc0MzIxNw==';

export const ContactBar: React.FC = () => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const copyToClipboard = (num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200">
        <div className="text-center mb-5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Contact KBR Holidays
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bookings · Inquiries · Tour Schedules
          </p>
        </div>

        {/* 3 Contact Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {CONTACT_NUMBERS.map((contact) => (
            <div
              key={contact.raw}
              className="bg-slate-50 hover:bg-slate-100/90 rounded-xl p-3 border border-slate-200 flex flex-col justify-between transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">Mobile</span>
                <button
                  onClick={() => copyToClipboard(contact.raw)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title="Copy number"
                >
                  {copiedNumber === contact.raw ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="text-sm font-bold text-slate-900 font-mono tabular-nums mb-3">
                {contact.display}
              </div>

              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200">
                <a
                  href={`tel:${contact.raw}`}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>

                <a
                  href={`https://wa.me/91${contact.raw}?text=Hello%20KBR%20Holidays%2C%20I%20would%20like%20to%20inquire%20about%20bookings.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Chat</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Profile Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-xl border border-pink-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Instagram Official</div>
              <div className="text-xs text-slate-600">@kbr__holidays</div>
            </div>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow on Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactBar;
