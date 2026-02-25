// Centralised role constants to avoid hardcoded strings throughout the app.
// All files should import from here when checking or assigning roles.

export const ROLES = {
  ADMIN: "admin",
  PRACTITIONER: "practitioner",
  PATIENT: "patient",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
