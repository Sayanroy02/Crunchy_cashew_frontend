export const COLORS = {
  // Brand Colors (Elite Pastel Yellow Theme)
  primary: '#F6B000',         // York Yellow (Main Accent)
  primaryLight: '#FFD54F',    // Lighter Yellow
  secondary: '#FFFE71',       // High-vibrancy Yellow
  yellow: '#F6B000',          // York Yellow
  amber: '#FBB21B',           // Amber highlights
  bg: '#FFF9E7',              // Subtle Light Yellow Background
  bgMobile: '#FFF9E7',        // Unified background for mobile
  white: '#ffffff',
  black: '#000000',
  danger: '#ef4444',          // Red

  // Semantic Variables
  button: '#F6B000',          // York Yellow CTA
  buttonText: '#000000',      // Solid Black text on York Yellow 
  heading: '#00863D',         // Pure Black Headings
  text: '#000000',            // Pure Black Text
  card: '#ffffff',            // Card Color
  highlight: '#F6B000',       // Highlight Color (York Yellow)
  accent: '#F6B000',          // Accent Color
  footerBg: '#000000',        // Pure Black for Footer
  green: '#0A5246',           // Dark Bottle Green
} as const;

/* Old Colors (Commented Out for Reference)
  // Espresso (Pastel Royale)
  espresso: '#3A2A1F',        // Deep Espresso Brown
  espressoFooter: '#211710',  // Dark Espresso

  // Bottle Green (Original)
  green: '#0A5246',           // Dark Bottle Green
  greenLight: '#0B5143',      // Slightly Lighter Green
  greenBg: '#E1EDEB',         // Light Minty Background
*/


/** Full-page loading spinner */
export const CLS_SPINNER = `w-10 h-10 border-4 border-[${COLORS.primaryLight}] border-t-transparent rounded-full animate-spin`;

/** Primary filled button (York Yellow) */
export const CLS_BTN_PRIMARY =
  `bg-[${COLORS.button}] text-[${COLORS.buttonText}] font-bold rounded-xl px-6 py-3 hover:opacity-90 transition-all disabled:opacity-60 shadow-lg shadow-[#F6B000]/20`;

/** York Yellow CTA button (High Visibility) */
export const CLS_BTN_CTA =
  `bg-[${COLORS.button}] text-[${COLORS.buttonText}] font-bold rounded-xl px-8 py-3.5 hover:scale-105 transition-all shadow-xl shadow-[#F6B000]/30`;

/** Ghost/outline button */
export const CLS_BTN_GHOST =
  `border-2 border-gray-200 text-gray-600 font-bold rounded-xl px-6 py-3 hover:border-[${COLORS.primary}] transition-colors`;

/** Form input */
export const CLS_INPUT =
  `w-full border border-gray-200 bg-white/50 rounded-xl px-4 py-3 focus:outline-none focus:border-[${COLORS.button}] focus:ring-1 focus:ring-[${COLORS.button}] font-semibold text-gray-800 transition-all`;

// ── Order Status Classes ───────────────────────────────────────────────────────

/** Tailwind classes for order status badges (border + bg + text) */
export const ORDER_STATUS_CLASSES: Record<string, string> = {
  'Order placed': 'bg-black text-white border-black',
  Pending: 'bg-[#F6B000] text-black border-[#F6B000]',
  Accepted: 'bg-[#F6B000] text-black border-[#F6B000]',
  Dispatched: 'bg-[#F6B000] text-black border-[#F6B000]',
  Shipped: 'bg-[#F6B000] text-black border-[#F6B000]',
  Delivered: 'bg-black text-white border-black',
  Cancelled: 'bg-red-500 text-white border-red-500',
  // Admin variant (border style used in admin panel)
  Pending_admin: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  Accepted_admin: 'bg-blue-100 text-blue-700 border border-blue-300',
  Dispatched_admin: 'bg-purple-100 text-purple-700 border border-purple-300',
  Shipped_admin: 'bg-indigo-100 text-indigo-700 border border-indigo-300',
  Delivered_admin: 'bg-green-100 text-green-700 border border-green-300',
  Cancelled_admin: 'bg-red-100 text-red-700 border border-red-300',
} as const;


/** Tailwind classes for payment status badges */
export const PAYMENT_STATUS_CLASSES: Record<string, string> = {
  Paid: 'bg-black text-white border-black',
  Pending: 'bg-[#F6B000] text-black border-[#F6B000]',
  Failed: 'bg-red-500 text-white border-red-500',
  COD: 'bg-black text-white border-black',
} as const;

// ── Order Status Flow ──────────────────────────────────────────────────────────

/** Ordered stages for the progress stepper */
export const ORDER_STATUS_FLOW = [
  'Order placed',
  'Accepted',
  'Dispatched',
  'Shipped',
  'Delivered',
] as const;

export type OrderStatus = typeof ORDER_STATUS_FLOW[number] | 'Cancelled' | 'Pending';

/** Statuses where a customer can still cancel */
export const CANCELLABLE_STATUSES = ['Order placed', 'Pending', 'Accepted'];
