export const COLORS = {
  primary: '#0B5143',        // Deep green — main brand color
  primaryLight: '#6bbc45',   // Light green — accents, icons
  yellow: '#f6d70f',         // Yellow — CTA backgrounds
  amber: '#FBB21B',          // Amber — star ratings, avatar backgrounds
  bg: '#E1EDEB',             // Page background
  bgMobile: '#f8f9fa',       // Mobile profile background
  white: '#ffffff',
  danger: '#ef4444',         // Red for cancel / error
} as const;


/** Full-page loading spinner */
export const CLS_SPINNER = 'w-10 h-10 border-4 border-[#0B5143] border-t-transparent rounded-full animate-spin';

/** Primary filled button */
export const CLS_BTN_PRIMARY =
  'bg-[#0B5143] text-white font-bold rounded-xl px-6 py-3 hover:bg-green-900 transition-colors disabled:opacity-60';

/** Yellow CTA button */
export const CLS_BTN_CTA =
  'bg-[#f6d70f] text-[#0B5143] font-bold rounded-xl hover:bg-yellow-400 transition-all';

/** Ghost/outline button */
export const CLS_BTN_GHOST =
  'border-2 border-gray-200 text-gray-600 font-bold rounded-xl px-6 py-3 hover:border-[#0B5143] transition-colors';

/** Form input */
export const CLS_INPUT =
  'w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0B5143] focus:ring-1 focus:ring-[#0B5143] font-semibold text-gray-800';

// ── Order Status Classes ───────────────────────────────────────────────────────

/** Tailwind classes for order status badges (border + bg + text) */
export const ORDER_STATUS_CLASSES: Record<string, string> = {
  'Order placed': 'bg-gray-50 text-gray-600 border-gray-200',
  Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Accepted: 'bg-blue-50 text-blue-700 border-blue-200',
  Dispatched: 'bg-purple-50 text-purple-700 border-purple-200',
  Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Delivered: 'bg-green-50 text-green-700 border-green-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
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
  Paid: 'bg-green-100 text-green-700 border border-green-300',
  Pending: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  Failed: 'bg-red-100 text-red-700 border border-red-300',
  COD: 'bg-amber-100 text-amber-700 border border-amber-300',
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
