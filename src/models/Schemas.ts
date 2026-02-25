// Mongoose schema definitions for the Clinic Appointment System's MongoDB database.
// Defines four collections: Doctor (practitioner profiles), Appointment (booking
// records with patient details, billing, and overlap-safe time slots), Settings
// (global clinic configuration), and User (authentication with role-based access,
// bcrypt-hashed passwords, and practitioner-to-doctor linking via doctorId).
import mongoose, { Document, Model, Schema } from 'mongoose';

// --- Doctor Schema ---
export interface IDoctor extends Document {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  specialisation: string;
  phoneNo: string;
}

const DoctorSchema: Schema = new Schema({
  title: { type: String, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: false },
  address: { type: String, required: false },
  specialisation: { type: String, required: false },
  phoneNo: { type: String, required: true, unique: true },
});

export const Doctor: Model<IDoctor> = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);


// --- Appointment Schema ---
export interface IAppointment extends Document {
  patient: {
    firstName: string;
    lastName: string;
    gender: 'Male' | 'Female' | 'Other';
    email: string;
    phoneNo: string;
  };
  doctorId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  appointmentType: string;
  durationMinutes: number;
  message?: string;
  billing: {
    cost: number;
    statementIssued: boolean;
  };
}

const AppointmentSchema: Schema = new Schema({
  patient: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    email: { type: String, required: true },
    phoneNo: { type: String, required: true },
  },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  appointmentType: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  message: { type: String },
  billing: {
    cost: { type: Number, required: true },
    statementIssued: { type: Boolean, default: false }
  }
}, { timestamps: true });

export const Appointment: Model<IAppointment> = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);


// --- Settings Schema ---
export interface ISettings extends Document {
  cost: number;
  email: string;
  onlineLocation: string;
  offlineLocation: string;
  apptSlotInterval: number;
  daysOfWeekAllowed: string; // e.g. "2,3,4,5"
}

const SettingsSchema: Schema = new Schema({
  cost: { type: Number, required: true, default: 0 },
  email: { type: String, required: true, unique: true },
  onlineLocation: { type: String },
  offlineLocation: { type: String },
  apptSlotInterval: { type: Number, required: true },
  daysOfWeekAllowed: { type: String, required: true }, // "1,2,3,4,5" representing Days
}, { timestamps: true });

export const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);


// --- User Schema (Authentication) ---
export interface IUser extends Document {
  email: string;
  password: string;           // bcrypt hash
  role: 'admin' | 'practitioner' | 'patient';
  firstName: string;
  lastName: string;
  phoneNo?: string;
  doctorId?: mongoose.Types.ObjectId;   // links practitioner users to their Doctor record
  isApproved: boolean;                  // true for patients, false until admin promotes to practitioner
  needsPasswordReset?: boolean;         // true for auto-created accounts (guest bookings)
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'practitioner', 'patient'],
    required: true,
    default: 'patient',
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNo: { type: String },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  isApproved: { type: Boolean, default: true },
  needsPasswordReset: { type: Boolean, default: false },
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
