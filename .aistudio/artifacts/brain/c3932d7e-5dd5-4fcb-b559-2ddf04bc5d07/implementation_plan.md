# KBR Holidays - Minimalist Web Experience & Wall Calendar

A clean, responsive web application for **KBR Holidays** featuring a minimalist branded Home page and a custom-crafted Monthly Wall Calendar replicating the user's reference template with dynamic date navigation, current-day highlighting in blue, and direct contact integration.

## User Review & Critical Decisions

> [!IMPORTANT]
> The implementation strictly honors the user's confirmed preferences:
> - **Home View**: Kept intentionally clean and uncluttered ("emptya erukkatu") with the official KBR Holidays circular insignia, taglines ("Journey Beyond Dreams"), and direct contact links.
> - **Calendar View**: Pure wall calendar presentation replicating the provided template (`image.png`), complete with the blue header banner, red weekend markers (`Sun` and `Sat`), clean grid cells, previous/next month switching, and the current active date marked in distinctive blue.
> - **Concise & Direct**: No bloated text or unnecessary marketing paragraphs ("more then words use pannadha"), keeping token efficiency and crisp UI responsiveness.

- **Confirmed Decision 1**: Clean, empty-style Home tab highlighting the brand identity and official contact info without clutter.
- **Confirmed Decision 2**: Display-focused Wall Calendar adhering exactly to the spreadsheet wall calendar layout with live navigation.
- **Confirmed Decision 3**: Quick-access contact bar and modal with phone numbers (9025022792, 9080439187, 8925389065) and direct Instagram profile link.

---

## 1. Overview & Core Concept

- **What It Does**: Provides customers and travelers of KBR Holidays with a fast, responsive interface to view the operational monthly calendar (with instant previous/next month navigation and blue current-day marker), view contact channels (call / WhatsApp / Instagram), and enjoy a clean, luxury travel brand atmosphere.
- **Target Audience**: Holiday travelers, tour booking clients, and bus charter customers across mobile, tablet, and desktop.
- **Key Value**: Instant, zero-bloat access to the schedule calendar and direct contact with KBR Holidays.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Home Experience**:
   - Clean, refined top navigation bar with brand logo, "Home" and "Calendar" tabs, and a "Contact" quick-dial button.
   - Minimalist hero area featuring the full KBR Holidays emblem ("Journey Beyond Dreams"), luxury bus travel motif, phone numbers, and Instagram link.
2. **Calendar View Experience**:
   - Monthly Wall Calendar faithful to the reference template:
     - Top blue header band (`#2B579A` / deep royal blue) displaying `[Month]-[Year]` (e.g. `October-2026`).
     - Sub-bar with calendar controls: `< Previous Month`, `Today`, and `Next Month >`.
     - Days of Week Header: `Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`.
     - Red styling for `Sun` and `Sat` day headers and numbers, matching the reference image.
     - Dark crisp styling for weekdays (`Mon` to `Fri`).
     - Prominent **Blue highlight** (`bg-blue-600 text-white rounded-lg` with subtle glow) marking the current day in the active month.
     - Empty trailing/leading cells neatly formatted matching wall calendar table borders.
3. **Contact & Social Actions**:
   - Direct click-to-call buttons for each of the 3 numbers:
     - `+91 90250 22792`
     - `+91 90804 39187`
     - `+91 89253 89065`
   - Verified Instagram link to `@kbr__holidays`.

### Visual Identity & Theme
- **Dominant Colors**: Deep Navy Blue (`#0F2042`), Royal Calendar Blue (`#2B579A`), Warm Tour Gold (`#D4AF37`), Crisp White (`#FFFFFF`), Weekend Red (`#DC2626`).
- **Typography**: Clean, geometric modern sans (`Plus Jakarta Sans` / system modern sans) with `tabular-nums` for calendar numbers.
- **Responsive Geometry**: Desktop 1440px presence with fluid scaling down to mobile viewports, ensuring the calendar grid never clips or overflows.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Native Dynamic Calendar Engine vs Third-Party Heavy Library**
  - *Chosen Approach*: Lightweight, custom-built native TypeScript calendar math with date navigation.
  - *Why*: Delivers 100% pixel-perfect styling fidelity matching the user's reference image without bloated bundle size or unnecessary script dependencies.
- **Decision 2: Faithful Asset Rendering of KBR Holidays Logo**
  - *Chosen Approach*: High-definition SVG & vector asset representation of the circular KBR Holidays emblem featuring the luxury tour bus, coastal route, palms, mountain skyline, and golden swoosh.
  - *Why*: Crisp at all resolutions, zero loading delay, and completely immune to external URL breakage.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       App Container                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │     Top Navigation Bar: Brand · Home · Calendar       │  │
│  └───────────────────────────────────────────────────────┘  │
│                             │                               │
│              Active View State ('home' | 'calendar')        │
│              ┌──────────────┴──────────────┐                │
│              ▼                             ▼                │
│   ┌───────────────────────┐   ┌──────────────────────────┐  │
│   │       Home View       │   │      Calendar View       │  │
│   │ - KBR Holidays Emblem │   │ - Month-Year Blue Banner │  │
│   │ - Clean Minimal Body  │   │ - Month Nav (< / >)      │  │
│   │ - Contact Card & Links│   │ - Sun/Sat in Red         │  │
│   │                       │   │ - Current Day in Blue    │  │
│   └───────────────────────┘   └──────────────────────────┘  │
│                             │                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Footer / Quick Contact Bar: Phone Numbers & IG Link  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

- **State Management**:
  - `activeTab`: `'home' | 'calendar'`
  - `currentDate`: `Date` object initialized to local time.
  - `selectedMonthDate`: `Date` object storing the month/year currently navigated to.
- **Calendar Logic**:
  - Dynamically computes starting day of the week, total days in month, and preceding/trailing grid offsets.
  - Identifies if a rendered date matches `currentDate.getFullYear()`, `currentDate.getMonth()`, and `currentDate.getDate()` to mark it in blue.
  - Formats weekend columns (column 0 = Sunday, column 6 = Saturday) with bold red text.

---

## 5. Implementation Steps

1. Update `metadata.json` and `index.html` with title `KBR Holidays` and appropriate meta descriptions.
2. Build the vector-rendered high-fidelity KBR Holidays circular emblem and travel motifs.
3. Implement the Wall Calendar engine matching the Spreadsheet123 template with previous/next controls, today button, red weekends, and blue active-day badge.
4. Implement the clean Home view with brand presence and direct contact channels.
5. Verify responsive layout across mobile and desktop, run `compile_applet`, and verify zero errors.
