export interface User {
  id: string;
  name: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  start: Date;
  end: Date;
  entryFee: number;
  proFee: number;
  isActive: boolean;
  charityIds: string[];
  finalPeakOrders?: number | null;
  createdBy: string; // userId of the leader who created this event
  createdAt: Date;
  registrationOpensAt: Date; // when users can start entering guesses
}

export type PaymentMethod = "zelle" | "venmo";

export interface Donation {
  id: string;
  userId: string;
  eventId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentNote?: string;
  isPaid: boolean;
  createdAt: Date;
  userName?: string;
}

export interface Guess {
  id: string;
  eventId: string;
  userId: string;
  value: number;
  createdAt: Date;
  totalDonation: number; // includes entry fee + extra donations
  paymentMethod: PaymentMethod;
  paymentNote?: string;
  isPaid: boolean;
  charityId?: string; // where donations are directed
  donationId?: string; // reference to the Donation record
  userName?: string;
}

// Optional display name stored on guesses/donations for guest flows
export interface NamedRecord {
  userName?: string;
}

export interface ProAccess {
  id: string;
  eventId: string;
  userId: string;
  grantedAt: Date;
}

export interface HistoricalDataPoint {
  year: number;
  peakOrders: number;
}
