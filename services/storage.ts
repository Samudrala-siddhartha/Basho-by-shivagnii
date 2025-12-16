import { Order, WorkshopBooking, UserProfile } from '../types';

const KEYS = {
  SESSION: 'basho_active_session', // The currently logged in user
  DB_USERS: 'basho_db_users',      // "Database" of registered users
  ORDERS: 'basho_orders',
  BOOKINGS: 'basho_bookings',
};

// --- Authentication & Session Management ---

// Get currently logged in user
export const getUserProfile = (): UserProfile | null => {
  const data = sessionStorage.getItem(KEYS.SESSION); // Using sessionStorage for security (clears on tab close)
  return data ? JSON.parse(data) : null;
};

// Login: Check if user exists in "DB", then set session
export const loginUser = (email: string): boolean => {
  const dbUsers = getRegisteredUsers();
  const user = dbUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (user) {
    sessionStorage.setItem(KEYS.SESSION, JSON.stringify(user));
    return true;
  }
  return false;
};

// Signup: Add to "DB", then set session
export const registerUser = (name: string, email: string): void => {
  const dbUsers = getRegisteredUsers();
  
  // Update if exists, or add new
  const existingIndex = dbUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  const newUser = { name, email };

  if (existingIndex >= 0) {
    dbUsers[existingIndex] = newUser;
  } else {
    dbUsers.push(newUser);
  }

  localStorage.setItem(KEYS.DB_USERS, JSON.stringify(dbUsers));
  sessionStorage.setItem(KEYS.SESSION, JSON.stringify(newUser));
};

export const logoutUser = () => {
  sessionStorage.removeItem(KEYS.SESSION);
};

// Helper to get all registered users
const getRegisteredUsers = (): UserProfile[] => {
  const data = localStorage.getItem(KEYS.DB_USERS);
  return data ? JSON.parse(data) : [];
};

// --- Orders (Filtered by Active Session) ---
export const saveOrder = (order: Order) => {
  const currentUser = getUserProfile();
  // Attach current user email to order if logged in
  if (currentUser) {
    order.userEmail = currentUser.email;
  }

  const existing = getAllOrdersRaw();
  localStorage.setItem(KEYS.ORDERS, JSON.stringify([order, ...existing]));
};

export const getOrders = (): Order[] => {
  const allOrders = getAllOrdersRaw();
  const currentUser = getUserProfile();

  if (!currentUser) return []; // Don't show orders if not logged in
  
  // Filter orders belonging to this user
  return allOrders.filter(o => o.userEmail === currentUser.email);
};

const getAllOrdersRaw = (): Order[] => {
  const data = localStorage.getItem(KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
};

// --- Bookings (Filtered by Active Session) ---
export const saveBooking = (booking: WorkshopBooking) => {
  const currentUser = getUserProfile();
  if (currentUser) {
    booking.userEmail = currentUser.email;
  }

  const existing = getAllBookingsRaw();
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify([booking, ...existing]));
};

export const getBookings = (): WorkshopBooking[] => {
  const allBookings = getAllBookingsRaw();
  const currentUser = getUserProfile();

  if (!currentUser) return [];
  
  return allBookings.filter(b => b.userEmail === currentUser.email);
};

const getAllBookingsRaw = (): WorkshopBooking[] => {
  const data = localStorage.getItem(KEYS.BOOKINGS);
  return data ? JSON.parse(data) : [];
};

// --- Stats Calculation ---
export const getDashboardStats = () => {
  const orders = getOrders();
  const bookings = getBookings();
  
  const totalOrders = orders.length;
  const totalBookings = bookings.length;
  
  const spentOnOrders = orders.reduce((acc, curr) => acc + curr.total, 0);
  const spentOnBookings = bookings.reduce((acc, curr) => acc + curr.price, 0);
  
  return {
    totalOrders,
    totalBookings,
    totalSpent: spentOnOrders + spentOnBookings
  };
};

// --- Legacy Support (Wrapper to keep existing calls working if any) ---
export const saveUserProfile = (profile: UserProfile) => {
  // Redirect to register logic
  registerUser(profile.name, profile.email);
};