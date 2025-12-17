import { Order, WorkshopBooking, UserProfile } from '../types';

const KEYS = {
  ORDERS: 'basho_orders',
  BOOKINGS: 'basho_bookings',
  USERS: 'basho_users',
  CURRENT_USER: 'basho_current_user',
};

// --- Helper for consistent email handling ---
const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

// --- Authentication ---

export const registerUser = (name: string, email: string): boolean => {
  const users = getAllUsers();
  const safeEmail = normalizeEmail(email);
  
  // Check if user exists to avoid duplicates
  const existingUserIndex = users.findIndex(u => normalizeEmail(u.email) === safeEmail);
  
  if (existingUserIndex === -1) {
      // Create new user, implicitly verified
      const newUser: UserProfile = { 
        name: name.trim(), 
        email: safeEmail,
      };
      users.push(newUser);
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      console.log(`[Storage] Registered new user: ${safeEmail}`);
      return true;
  } else {
      console.log(`[Storage] User already exists: ${safeEmail}`);
      return false; // User already exists
  }
};

// Removed: export const verifyUser = (email: string): void => { ... };

export const checkUserExists = (email: string): boolean => {
  const users = getAllUsers();
  const safeEmail = normalizeEmail(email);
  return users.some(u => normalizeEmail(u.email) === safeEmail);
};

export const loginUser = (email: string): boolean => {
  const users = getAllUsers();
  const safeEmail = normalizeEmail(email);
  
  const user = users.find(u => normalizeEmail(u.email) === safeEmail);
  
  if (user) {
    // User is considered logged in and verified immediately for hackathon demo
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    console.log(`[Storage] User logged in: ${safeEmail}`);
    return true;
  }
  
  console.warn(`[Storage] Login failed. User not found: ${safeEmail}`);
  console.debug('[Storage] Available users:', users.map(u => u.email));
  return false;
};

export const getUserProfile = (): UserProfile | null => {
  try {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const logoutUser = (): void => {
    localStorage.removeItem(KEYS.CURRENT_USER);
};

const getAllUsers = (): UserProfile[] => {
    try {
        const data = localStorage.getItem(KEYS.USERS);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

// --- Orders ---
export const saveOrder = (order: Order) => {
  const user = getUserProfile();
  // Associate order with current user if logged in
  if (user && !order.userEmail) {
      order.userEmail = user.email; // Already normalized from profile
  }
  
  const existing = getAllOrdersRaw();
  localStorage.setItem(KEYS.ORDERS, JSON.stringify([order, ...existing]));
};

export const getOrders = (): Order[] => {
  const allOrders = getAllOrdersRaw();
  const user = getUserProfile();
  
  if (user) {
      // Filter strictly by normalized email
      return allOrders.filter(o => o.userEmail && normalizeEmail(o.userEmail) === normalizeEmail(user.email));
  }
  return []; // If not logged in, show nothing (or all if that was the intent, but strictly for auth it should be own orders)
};

const getAllOrdersRaw = (): Order[] => {
  const data = localStorage.getItem(KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
};

// --- Bookings ---
export const saveBooking = (booking: WorkshopBooking) => {
  const user = getUserProfile();
  if (user && !booking.userEmail) {
      booking.userEmail = user.email;
  }
  
  const existing = getAllBookingsRaw();
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify([booking, ...existing]));
};

export const getBookings = (): WorkshopBooking[] => {
  const allBookings = getAllBookingsRaw();
  const user = getUserProfile();
  
  if (user) {
      return allBookings.filter(b => b.userEmail && normalizeEmail(b.userEmail) === normalizeEmail(user.email));
  }
  return [];
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