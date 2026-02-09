# 🕍 Bat Mitzvah Management App - Premium Edition

מערכת ניהול אירוע בת מצווה מתקדמת, המעוצבת בגישת Mobile-First עם דגש על חווית משתמש (UX) פרימיום, אנימציות חלקות ועיצוב Glassmorphism מודרני.

---

## 📚 1. ארכיטקטורה, עיצוב ומפרט טכני

### 🛠 טכנולוגיות (Tech Stack)
*   **Frontend Framework:** React 18 (Vite)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (Custom Config for Cyber/Neon theme)
*   **Animations:** Framer Motion (Page transitions, micro-interactions)
*   **Backend / DB:** Firebase (Firestore, Auth, Storage)
*   **Icons:** Lucide React

### 🎨 עקרונות העיצוב (Design System)
האפליקציה משתמשת בשפת עיצוב **"Cyber-Glass"**:
*   **פלטת צבעים:** רקע כהה עמוק (`#1e1b4b`), מבטאים של סגול ניאון (`#c084fc`) וורוד (`#f472b6`).
*   **Glassmorphism:** שימוש נרחב ב-`backdrop-filter: blur` ליצירת שכבות זכוכית שקופות למחצה על גבי רקע חי.
*   **אנימציות רקע:** מערכת חלקיקים (Particles) מרחפים בקובץ `index.html`.
*   **טיפוגרפיה:** גופן `Heebo` לעברית ו-`Outfit` למספרים/אנגלית.

### 🏗 ארכיטקטורת הקוד
האפליקציה בנויה במבנה שטוח יחסית לביצועים מקסימליים:

1.  **`App.tsx` (Controller):**
    *   משמש כ"מוח" של האפליקציה.
    *   מנהל את כל התקשורת מול Firebase (Real-time Listeners).
    *   מנהל את ה-State הגלובלי (אורחים, ברכות, תמונות).
    *   מכיל לוגיקת **Optimistic UI**: עדכון הממשק *לפני* קבלת אישור מהשרת (חיוני לחוויה חלקה ולמניעת כפתורים נתקעים).
    *   מנתב בין תצוגת אורח (`GuestView`) לתצוגת מנהל (`AdminView`).

2.  **`views/GuestView.tsx` (Client Side):**
    *   **טאבים:** אירוע (בית), אישור הגעה, ברכות, גלריה.
    *   **Hero Section:** טיימר ספירה לאחור + תמונת נושא.
    *   **RSVP:** טופס חכם לאישור הגעה עם פירוט (מבוגרים/ילדים/תינוקות).
    *   **קיר ברכות:** מאפשר הוספה, **עריכה ומחיקה** של ברכות בזמן אמת.
    *   **גלריה:** העלאת תמונות ל-Firebase Storage והצגתן ב-Grid רספונסיבי.

3.  **`views/AdminView.tsx` (Management Side):**
    *   **Dashboard:** סטטיסטיקות הגעה, תקציב מול ביצוע, גרף תפוסה.
    *   **Guest Management:** טבלה לניהול מוזמנים, חיפוש, ומחיקה.
    *   **Seating Chart:** מערכת Drag & Drop לשיבוץ אורחים בשולחנות (עגולים/אבירים).
    *   **Budget:** ניהול הוצאות, מעקב "שולם/לא שולם".

### 🌟 פיצ'רים מרכזיים (Features)

#### צד אורח (Guest Experience)
*   **ניווט צף:** תפריט זכוכית צף בתחתית המסך (Mobile optimized).
*   **אישור הגעה (RSVP):** ממשק נוח לבחירת כמות אורחים. אנימציית Confetti בסיום.
*   **קיר ברכות חכם:**
    *   הוספת ברכה חדשה.
    *   **עריכה/מחיקה:** כל משתמש יכול לערוך או למחוק כל ברכה (דרישה ספציפית).
    *   מנגנון Fallback: אם אין אינטרנט או Firebase חסום, הברכה נשמרת מקומית (Demo Mode).
*   **בקשת שירים:** שליחת בקשות לדיג'יי.
*   **גלריה חיה:** העלאת תמונות מהנייד שמופיעות אצל כולם.

#### צד מנהל (Admin Dashboard)
*   כניסה מאובטחת (או מצב Demo).
*   תצוגת KPI (כמה אישרו הגעה, כמה כסף יצא).
*   ייצוא רשימת מוזמנים לוואטסאפ.
*   ניהול סידורי הושבה ויזואלי.

---

## 🤖 2. ה-Prompt המלא (לשיחזור הפרויקט)

הנה הפרומפט המדויק שכולל את כל ההוראות, העיצובים והלוגיקה שנבנתה עד כה. הזנת פרומפט זה ל-AI תחזיר את האפליקציה במצבה הנוכחי.

```text
Act as a world-class Senior Full-stack Developer aimed at building a premium, mobile-first Bat Mitzvah Management App.

**Tech Stack:** React (Vite), TypeScript, Tailwind CSS, Framer Motion, Firebase (Firestore, Auth, Storage), Lucide React.

**Design Language:**
- Theme: "Cyber-Glass". Dark deep blue background (#1e1b4b) with neon purple/pink accents.
- UI Style: Heavy use of Glassmorphism (translucent panels, blurs, white borders with low opacity).
- Animations: Smooth page transitions using AnimatePresence, floating particle background in pure CSS/JS in index.html, Confetti on success.
- Font: 'Heebo' for Hebrew, 'Outfit' for numbers/English.

**Core Architecture:**
1. Single Page Application (SPA) with Conditional Rendering for Views (Guest vs Admin).
2. "App.tsx" acts as the central controller handling all Firebase listeners and State.
3. Implementation of "Optimistic UI" is MANDATORY: When a user performs an action (add/edit/delete), update the local state IMMEDIATELY before waiting for the server response. This applies especially to Blessings to prevent spinning loaders from getting stuck.

**Required Features & Views:**

1. **Guest View (Public):**
   - **Floating Navigation:** A glass-morphic bottom navigation bar with tabs: Home, RSVP, Blessings, Gallery.
   - **Home Tab:** Hero image, Live Countdown timer, Event details (Location/Waze), Song Request form.
   - **RSVP Tab:** Multi-step form. Step 1: Name. Step 2: Counters for Adults, Children, Babies. On submit -> Fire Confetti -> Save to Firestore.
   - **Blessings Tab (Crucial Logic):** 
     - A wall of greeting cards.
     - Form to add a new blessing (Sender Name + Content).
     - **Edit/Delete Logic:** EVERY blessing card must have Edit (pencil) and Delete (trash) buttons visible to everyone. 
     - When adding/editing, the UI must update instantly (Optimistic).
     - ID generation for new blessings must happen client-side to ensure buttons work immediately.
   - **Gallery Tab:** Masonry grid layout. Button to upload photos to Firebase Storage.

2. **Admin View (Protected):**
   - Login Screen (include a "Demo Mode" bypass with mock credentials).
   - **Dashboard:** Stats cards (Total confirmed, Budget est vs actual), Progress bar for capacity.
   - **Guest Management:** Searchable table of guests, status, and delete option. Export to WhatsApp button.
   - **Seating Chart:** Drag and drop interface. Sidebar with unassigned guests. Main area with tables (Round/Long). Visual indication when tables are full.
   - **Budget Tracker:** List of expenses, estimated vs actual cost, "Paid" toggle switch.

3. **General Requirements:**
   - **Responsive:** Must look perfect on mobile.
   - **Offline/Demo Friendly:** Wrap all Firebase calls in try/catch blocks. If Firebase fails (or is missing config), the app must continue working using local state (console log the error but don't crash the UI).
   - **Localization:** All text in Hebrew (RTL).

**Specific Implementation Details to Include:**
- In `App.tsx`, separate the `handleAddBlessing`, `handleUpdateBlessing`, and `handleDeleteBlessing` functions. Ensure they update the `blessings` state array immediately (`setBlessings`) before calling the async DB function.
- In `GuestView.tsx`, ensure the "Submit" button for blessings has a safety timeout so it never gets stuck in a "Loading" state.
- Create a `metadata.json` for permissions (camera/microphone).

Please generate the full project structure including `index.html` (with particles), `App.tsx`, `views/GuestView.tsx`, `views/AdminView.tsx`, `types.ts`, and `tailwind.config` setup within `index.html`.
```
