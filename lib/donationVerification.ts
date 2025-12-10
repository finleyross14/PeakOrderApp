import { Donation, Event, Guess } from "./types";

/**
 * Check if a user has made a donation for a specific event
 */
export function hasUserDonated(
  userId: string,
  eventId: string,
  donations: Donation[]
): boolean {
  return donations.some(
    (d) => d.userId === userId && d.eventId === eventId && d.isPaid
  );
}

/**
 * Get a user's total donation amount for an event
 */
export function getUserEventDonationTotal(
  userId: string,
  eventId: string,
  donations: Donation[]
): number {
  return donations
    .filter((d) => d.userId === userId && d.eventId === eventId && d.isPaid)
    .reduce((total, d) => total + d.amount, 0);
}

/**
 * Check if a user meets minimum donation requirement for guessing
 */
export function canUserGuess(
  userId: string,
  eventId: string,
  event: Event,
  donations: Donation[]
): {
  allowed: boolean;
  reason?: string;
} {
  // Check if registration is open
  const now = new Date();
  const regOpensAt = new Date(event.registrationOpensAt);

  if (now < regOpensAt) {
    return {
      allowed: false,
      reason: "Registration has not yet opened for this event",
    };
  }

  // Check if user has donated at least the entry fee
  const totalDonated = getUserEventDonationTotal(userId, eventId, donations);

  if (totalDonated < event.entryFee) {
    return {
      allowed: false,
      reason: `You must donate at least $${event.entryFee.toFixed(2)} to participate`,
    };
  }

  return { allowed: true };
}

/**
 * Check if a user can access pro features
 */
export function canUserAccessPro(
  userId: string,
  eventId: string,
  event: Event,
  donations: Donation[]
): {
  allowed: boolean;
  reason?: string;
} {
  // First check if they can guess (donation requirement)
  const guessCheck = canUserGuess(userId, eventId, event, donations);
  if (!guessCheck.allowed) {
    return guessCheck;
  }

  // Check if they've paid for pro access
  const totalDonated = getUserEventDonationTotal(userId, eventId, donations);
  const requiredForPro = event.entryFee + event.proFee;

  if (totalDonated < requiredForPro) {
    return {
      allowed: false,
      reason: `Pro access requires a total donation of $${requiredForPro.toFixed(2)}`,
    };
  }

  return { allowed: true };
}

/**
 * Check if registration is currently open for an event
 */
export function isRegistrationOpen(event: Event): boolean {
  const now = new Date();
  const regOpensAt = new Date(event.registrationOpensAt);
  return now >= regOpensAt;
}

/**
 * Check if an event is currently active (between start and end times)
 */
export function isEventActive(event: Event): boolean {
  const now = new Date();
  const start = new Date(event.start);
  const end = new Date(event.end);
  return now >= start && now <= end;
}
