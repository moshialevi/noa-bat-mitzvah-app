export interface EventDetails {
  name: string;
  eventType: string; // e.g., "בת מצווה"
  date: string; // ISO string
  locationName: string;
  address: string;
  wazeLink: string;
  heroImage: string;     // Background / Atmosphere image
  celebrantImage?: string; // Portrait of the girl
  hostPhone: string; // The phone number to receive WhatsApp RSVPs
}

export enum AppView {
  GUEST_LANDING = 'GUEST_LANDING',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  LOGIN = 'LOGIN'
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  attending: boolean | null;
  guestsCount: number;
  adultsCount: number;
  childrenCount: number;
  babiesCount: number;
  invitedCount: number;
  dietaryRestrictions: string;
  tableId?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  price: number;
  paid: number;
  contactInfo?: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  estimated: number;
  actual: number;
  paid: boolean;
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
}

export interface Table {
  id: string;
  name: string;
  type: 'round' | 'long';
  capacity: number;
}

export interface SongRequest {
  id: string;
  title: string;
  requestedBy: string;
}
