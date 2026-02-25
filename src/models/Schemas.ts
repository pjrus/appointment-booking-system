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
