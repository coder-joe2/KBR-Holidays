import React from 'react';

interface KbrLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const KbrLogo: React.FC<KbrLogoProps> = ({
  className = '',
  size = 280,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9943B" />
            <stop offset="35%" stopColor="#E8BD65" />
            <stop offset="70%" stopColor="#D4A143" />
            <stop offset="100%" stopColor="#9E6E1D" />
          </linearGradient>

          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="65%" stopColor="#EFF6FF" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>

          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0B2545" />
          </linearGradient>

          <linearGradient id="goldSwoosh" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#B47D28" />
            <stop offset="40%" stopColor="#F3CF7A" />
            <stop offset="70%" stopColor="#D8A542" />
            <stop offset="100%" stopColor="#8C5C12" />
          </linearGradient>

          <clipPath id="circleClip">
            <circle cx="250" cy="250" r="236" />
          </clipPath>
        </defs>

        {/* Outer Circular Badges */}
        <circle cx="250" cy="250" r="246" stroke="#0B2545" strokeWidth="8" fill="#FFFFFF" />
        <circle cx="250" cy="250" r="236" stroke="url(#goldRing)" strokeWidth="6" />

        {/* Inner Clipped Scenery */}
        <g clipPath="url(#circleClip)">
          {/* Subtle Sky background */}
          <rect x="0" y="0" width="500" height="500" fill="url(#skyGrad)" />

          {/* Mountains silhouette in background */}
          <path
            d="M320 370 L380 280 L440 330 L480 270 L510 370 Z"
            fill="#3B5368"
            opacity="0.85"
          />
          <path
            d="M360 370 L410 300 L470 370 Z"
            fill="#527088"
            opacity="0.75"
          />
          {/* Green hills */}
          <path
            d="M350 420 Q420 340 500 370 L500 480 L350 480 Z"
            fill="#2D5A27"
          />

          {/* Sun setting over sea */}
          <circle cx="160" cy="350" r="32" fill="url(#sunGrad)" />

          {/* Calm Sea */}
          <path
            d="M40 365 C120 360 220 365 370 368 L370 410 C240 405 120 405 40 410 Z"
            fill="url(#seaGrad)"
            opacity="0.9"
          />

          {/* Palm Trees on Left Shore */}
          <g>
            {/* Trunk 1 */}
            <path d="M120 400 Q110 340 70 310" stroke="#0B2545" strokeWidth="4.5" strokeLinecap="round" />
            {/* Palm Fronds 1 */}
            <path d="M70 310 Q40 295 30 315" stroke="#0B2545" strokeWidth="3" fill="none" />
            <path d="M70 310 Q50 280 40 290" stroke="#0B2545" strokeWidth="3" fill="none" />
            <path d="M70 310 Q70 275 80 285" stroke="#0B2545" strokeWidth="3" fill="none" />
            <path d="M70 310 Q95 285 95 305" stroke="#0B2545" strokeWidth="3" fill="none" />
            <path d="M70 310 Q85 315 100 325" stroke="#0B2545" strokeWidth="3" fill="none" />

            {/* Trunk 2 */}
            <path d="M140 410 Q145 350 165 315" stroke="#0B2545" strokeWidth="4.5" strokeLinecap="round" />
            {/* Palm Fronds 2 */}
            <path d="M165 315 Q140 290 130 305" stroke="#0B2545" strokeWidth="3" fill="none" />
            <path d="M165 315 Q160 280 175 285" stroke="#0B2545" strokeWidth="3" fill="none" />
            <path d="M165 315 Q190 295 195 315" stroke="#0B2545" strokeWidth="3" fill="none" />
            <path d="M165 315 Q180 325 190 335" stroke="#0B2545" strokeWidth="3" fill="none" />
          </g>

          {/* Winding Highway Road */}
          <path
            d="M500 370 Q380 375 300 410 Q190 460 210 500 L500 500 Z"
            fill="#334155"
          />
          {/* Road White Lane Markings */}
          <path
            d="M480 380 Q370 395 300 430 Q230 468 250 500"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeDasharray="16 10"
            fill="none"
          />
          <path
            d="M470 385 Q365 400 295 435 Q220 472 240 500"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeDasharray="16 10"
            fill="none"
          />

          {/* Road Guardrail */}
          <path
            d="M120 430 Q220 410 380 372"
            stroke="#94A3B8"
            strokeWidth="3"
            fill="none"
          />

          {/* Modern White Luxury Coach Bus */}
          <g transform="translate(195, 310)">
            {/* Bus Shadow */}
            <ellipse cx="95" cy="115" rx="90" ry="8" fill="#000000" opacity="0.35" />

            {/* Bus Body */}
            <path
              d="M15 45 C15 30 25 22 45 20 L160 16 C172 16 178 22 180 32 L182 92 C182 100 178 104 170 105 L22 105 C14 105 12 100 12 94 L12 55 Z"
              fill="#FFFFFF"
              stroke="#0B2545"
              strokeWidth="2.5"
            />

            {/* Windshield & Windows */}
            {/* Front windshield */}
            <path
              d="M18 30 C24 25 32 23 48 23 L62 23 L62 68 L16 68 Z"
              fill="#0F2844"
            />
            {/* Passenger side windows */}
            <path
              d="M66 23 L174 19 C176 19 178 22 178 26 L178 52 L66 52 Z"
              fill="#1E3A5F"
            />
            {/* Window divider lines */}
            <line x1="88" y1="22" x2="88" y2="52" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />
            <line x1="110" y1="21" x2="110" y2="52" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />
            <line x1="132" y1="20" x2="132" y2="52" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />
            <line x1="154" y1="20" x2="154" y2="52" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />

            {/* Luxury Golden Livery Swirl on bus body */}
            <path
              d="M20 78 Q80 72 110 82 Q140 92 182 66 L182 72 Q140 98 108 88 Q75 78 20 84 Z"
              fill="url(#goldRing)"
            />

            {/* KBR HOLIDAYS print on bus side */}
            <text
              x="125"
              y="74"
              fill="#0B2545"
              fontSize="11"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              textAnchor="middle"
              letterSpacing="0.8"
            >
              KBR
            </text>
            <text
              x="125"
              y="84"
              fill="#64748B"
              fontSize="6"
              fontWeight="700"
              fontFamily="system-ui, -apple-system, sans-serif"
              textAnchor="middle"
              letterSpacing="1"
            >
              HOLIDAYS
            </text>

            {/* Headlights */}
            <ellipse cx="15" cy="80" rx="3" ry="5" fill="#FDE047" />
            <ellipse cx="14" cy="88" rx="2.5" ry="4" fill="#F87171" />

            {/* Front Rear-view Mirrors */}
            <path d="M22 25 L10 18 L10 28 Z" fill="#0B2545" />

            {/* Wheels & Rims */}
            {/* Front Wheel */}
            <circle cx="38" cy="104" r="14" fill="#1E293B" stroke="#0B2545" strokeWidth="2" />
            <circle cx="38" cy="104" r="7" fill="#CBD5E1" />
            {/* Rear Wheels (Twin axle) */}
            <circle cx="145" cy="104" r="13" fill="#1E293B" stroke="#0B2545" strokeWidth="2" />
            <circle cx="145" cy="104" r="6.5" fill="#CBD5E1" />
            <circle cx="168" cy="104" r="13" fill="#1E293B" stroke="#0B2545" strokeWidth="2" />
            <circle cx="168" cy="104" r="6.5" fill="#CBD5E1" />
          </g>

          {/* Flying Seagulls / Birds */}
          <path
            d="M210 82 Q220 72 230 82 Q240 72 250 82"
            stroke="#0B2545"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M195 98 Q202 90 210 98 Q218 90 226 98"
            stroke="#0B2545"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M255 78 Q264 68 274 78 Q284 68 294 78"
            stroke="#0B2545"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Sunken Arc Guide for KBR */}
          <path
            d="M100 240 Q250 130 400 240"
            stroke="none"
            fill="none"
            id="textArc"
          />

          {/* K B R Letters - Big, Bold, Luxury */}
          <g>
            {/* K */}
            <text
              x="135"
              y="210"
              fill="#0B2545"
              fontSize="92"
              fontWeight="900"
              fontFamily="Times New Roman, serif, Georgia"
              textAnchor="middle"
            >
              K
            </text>

            {/* B in Metallic Gold */}
            <text
              x="250"
              y="210"
              fill="url(#goldRing)"
              fontSize="96"
              fontWeight="900"
              fontFamily="Times New Roman, serif, Georgia"
              textAnchor="middle"
            >
              B
            </text>

            {/* R */}
            <text
              x="365"
              y="210"
              fill="#0B2545"
              fontSize="92"
              fontWeight="900"
              fontFamily="Times New Roman, serif, Georgia"
              textAnchor="middle"
            >
              R
            </text>

            {/* Dynamic Gold Swoosh under KBR */}
            <path
              d="M150 205 Q260 250 415 155 Q375 225 240 230 Q180 230 150 205 Z"
              fill="url(#goldSwoosh)"
            />
          </g>

          {/* — HOLIDAYS — */}
          <g>
            <line x1="75" y1="250" x2="115" y2="250" stroke="#C9943B" strokeWidth="2.5" />
            <text
              x="250"
              y="257"
              fill="#0B2545"
              fontSize="24"
              fontWeight="800"
              fontFamily="system-ui, -apple-system, sans-serif"
              textAnchor="middle"
              letterSpacing="7"
            >
              HOLIDAYS
            </text>
            <line x1="385" y1="250" x2="425" y2="250" stroke="#C9943B" strokeWidth="2.5" />
          </g>

          {/* Journey Beyond Dreams with gold dots */}
          <g>
            <circle cx="158" cy="285" r="3.5" fill="#C9943B" />
            <text
              x="250"
              y="290"
              fill="#0B2545"
              fontSize="20"
              fontStyle="italic"
              fontWeight="600"
              fontFamily="Georgia, 'Brush Script MT', cursive, serif"
              textAnchor="middle"
              letterSpacing="1"
            >
              Journey Beyond Dreams
            </text>
            <circle cx="342" cy="285" r="3.5" fill="#C9943B" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default KbrLogo;
