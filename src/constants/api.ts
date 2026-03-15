/**
 * Central API URL constants.
 * Change API_BASE once here to update ALL fetch calls across the entire app.
 * Import { API } from '@/constants/api' — never hardcode localhost:8000 in components.
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://crunchy-node-backend.onrender.com/';

export const API = {
  // ── Auth ─────────────────────────────────────────────────────────────────
  AUTH_LOGIN: `${API_BASE}/api/auth/login`,
  AUTH_REGISTER: `${API_BASE}/api/auth/register`,
  AUTH_GOOGLE: `${API_BASE}/api/auth/google`,
  AUTH_ME: `${API_BASE}/api/auth/me`,
  AUTH_PROFILE: `${API_BASE}/api/auth/profile`,

  // ── Products ──────────────────────────────────────────────────────────────
  PRODUCTS: `${API_BASE}/api/products/`,
  PRODUCT_DETAIL: (id: string) => `${API_BASE}/api/products/${id}`,

  // ── Orders ────────────────────────────────────────────────────────────────
  ORDERS: `${API_BASE}/api/orders/`,
  MY_ORDERS: `${API_BASE}/api/orders/my-orders`,
  ORDER_DETAIL: (id: string) => `${API_BASE}/api/orders/${id}`,
  ORDER_CANCEL: (id: string) => `${API_BASE}/api/orders/cancel/${id}`,
  ORDER_VERIFY: `${API_BASE}/api/orders/verify`,
  ORDER_TRACK: (id: string) => `${API_BASE}/api/orders/track/${id}`,
  ORDER_PAYMENT_CONFIRM: (id: string) => `${API_BASE}/api/orders/${id}/payment-status`,

  // ── Admin ─────────────────────────────────────────────────────────────────
  ADMIN_DASHBOARD: `${API_BASE}/api/admin/dashboard`,
  ADMIN_ORDERS: `${API_BASE}/api/admin/orders`,
  ADMIN_ORDER_STATUS: (id: string) => `${API_BASE}/api/admin/orders/${id}/status`,
  ADMIN_USERS: `${API_BASE}/api/admin/users`,
  ADMIN_CHANGE_PW: `${API_BASE}/api/admin/change-password`,
  ADMIN_BULK_ORDERS: `${API_BASE}/api/admin/bulk-orders`,
  ADMIN_BULK_STATUS: (id: string) => `${API_BASE}/api/admin/bulk-orders/${id}/status`,

  // ── Pincodes ──────────────────────────────────────────────────────────────
  PINCODES: `${API_BASE}/api/pincodes/`,
  PINCODES_CHECK: `${API_BASE}/api/pincodes/check`,
  PINCODES_ADD: `${API_BASE}/api/pincodes/admin/add`,
  PINCODES_REMOVE: (p: string) => `${API_BASE}/api/pincodes/admin/remove/${p}`,

  // ── Contact / Queries ─────────────────────────────────────────────────────
  CONTACT: `${API_BASE}/api/contact`,
  CONTACT_VISIT: `${API_BASE}/api/contact/visit`,
  CONTACT_ENQUIRY: `${API_BASE}/api/contact/enquiry`,
  MY_ENQUIRIES: `${API_BASE}/api/contact/my-enquiries`,
  MY_VISITS: `${API_BASE}/api/contact/my-visits`,
  ADMIN_ENQUIRIES: `${API_BASE}/api/contact/enquiries`,
  ADMIN_VISITS: `${API_BASE}/api/contact/visits`,
  CONTACT_STATUS: (type: string, id: string) => `${API_BASE}/api/contact/${type}/${id}/status`,

  // ── CMS ───────────────────────────────────────────────────────────────────
  TESTIMONIALS: `${API_BASE}/api/cms/testimonials`,
  BANNERS: `${API_BASE}/api/cms/banners`,
  BLOGS: `${API_BASE}/api/cms/blogs`,
  BLOG_DETAIL: (id: string) => `${API_BASE}/api/cms/blogs/${id}`,

  // ── Admin CMS ─────────────────────────────────────────────────────────────
  ADMIN_TESTIMONIALS: `${API_BASE}/api/cms/admin/testimonials`,
  ADMIN_TESTIMONIAL_APPROVE: (id: string) => `${API_BASE}/api/cms/admin/testimonials/${id}/approve`,
  ADMIN_TESTIMONIAL_DELETE: (id: string) => `${API_BASE}/api/cms/admin/testimonials/${id}`,
  ADMIN_BANNERS: `${API_BASE}/api/cms/admin/banners`,
  ADMIN_BANNER_DELETE: (id: string) => `${API_BASE}/api/cms/admin/banners/${id}`,
  ADMIN_BLOGS: `${API_BASE}/api/cms/admin/blogs`,
  ADMIN_BLOG: (id: string) => `${API_BASE}/api/cms/admin/blogs/${id}`,

  // ── Traffic ───────────────────────────────────────────────────────────────
  TRAFFIC_STATS: `${API_BASE}/api/traffic/stats`,
} as const;
