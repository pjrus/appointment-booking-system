# Database Schema Documentation

This document outlines the MongoDB schema used in the Clinic Appointment System. The models are defined using Mongoose in `src/models/Schemas.ts`.

## 1. Doctor Schema (`Doctor`)

Stores information about the healthcare practitioners available in the clinic.

| Field | Type | Required | Unique | Description |
| :--- | :--- | :---: | :---: | :--- |
| `title` | String | No | No | Professional title (e.g., Dr., Prof.) |
| `firstName` | String | Yes | No | Practitioner's first name |
| `lastName` | String | Yes | No | Practitioner's last name |
| `email` | String | No | No | Contact email address |
| `address` | String | No | No | Physical address |
| `specialisation` | String | No | No | Medical specialization (e.g., General Practice) |
| `phoneNo` | String | Yes | Yes | Contact phone number. Must be unique across all doctors. |

---

## 2. Appointment Schema (`Appointment`)

Records bookings made by patients with specific practitioners.

| Field | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| `patient.firstName` | String | Yes | - | Patient's first name |
| `patient.lastName` | String | Yes | - | Patient's last name |
| `patient.gender` | String | Yes | - | Patient's gender (`Male`, `Female`, `Other`) |
| `patient.email` | String | Yes | - | Patient's contact email |
| `patient.phoneNo` | String | Yes | - | Patient's contact phone number |
| `doctorId` | ObjectId | Yes | - | Reference to the `Doctor` collection |
| `date` | String | Yes | - | Appointment date in `YYYY-MM-DD` format |
| `startTime` | String | Yes | - | Start time of the consultation in `HH:mm` format |
| `endTime` | String | Yes | - | End time of the consultation in `HH:mm` format |
| `appointmentType` | String | Yes | - | Type of appointment (e.g., Standard Consultation) |
| `durationMinutes` | Number | Yes | - | Length of the appointment in minutes |
| `message` | String | No | - | Optional notes or symptoms provided by the patient |
| `billing.cost` | Number | Yes | - | The cost associated with this specific appointment |
| `billing.statementIssued`| Boolean| No | `false` | Whether a billing statement has been issued yet |
| `createdAt` | Date | Auto | - | Timestamp of when the booking was created |
| `updatedAt` | Date | Auto | - | Timestamp of the last modification |

---

## 3. Settings Schema (`Settings`)

Global configurations for the clinic, manageable by administrators.

| Field | Type | Required | Unique | Default | Description |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `cost` | Number | Yes | No | `0` | Default consultation cost ($) |
| `email` | String | Yes | Yes | - | The primary contact email for the clinic |
| `onlineLocation` | String | No | No | - | Telehealth/online meeting link (e.g., Zoom URL) |
| `offlineLocation` | String | No | No | - | Physical address of the clinic |
| `apptSlotInterval`| Number | Yes | No | - | Gap between generated available booking slots (in minutes) |
| `daysOfWeekAllowed`| String | Yes | No | - | Comma-separated list of days the clinic is open. `0` = Sunday, `6` = Saturday (e.g., `"1,2,3,4,5"` for Mon-Fri) |
| `createdAt` | Date | Auto | - | - | Timestamp of when settings were created |
| `updatedAt` | Date | Auto | - | - | Timestamp of the last settings modification |
