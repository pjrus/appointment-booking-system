# Appointment Booking System

## Project Description
A full-stack web application designed for scheduling consultations. Built using Next.js and a MongoDB backend, it demonstrates CRUD operations, database integration, and modern React server-side rendering.

## Tech Stack
- Frontend: Next.js, React, Tailwind CSS, TypeScript
- Backend: Next.js App Router (Server Actions/API Routes)
- Database: MongoDB via Mongoose

## Purpose & Background
This application is a modern rewrite of a PHP-based appointment booking system that I initially developed in high school as part of my VCE Software Development Project. Its core purpose is to replace manual booking methods (like diaries or spreadsheets) with a streamlined, digital interface. By migrating to a Next.js and MongoDB stack, it builds upon the original concept to further minimise administrative overhead and prevent double-bookings through robust server-side validation.

## Key Features & Design
- **Separation of Concerns:** Clean architecture separating frontend React components from Next.js server actions and API routes.
- **Conflict Prevention:** Active database querying and double-booking race condition protections guarantee no overlapping appointments.
- **Calendar Integration:** Automated `.ics` generation for clients to add bookings directly to their personal calendars.
- **Admin Dashboard & Settings:** Dedicated views (`/admin`) for practitioners to manage appointments, doctor profiles, and global clinic configuration.
- **Modern UI:** Responsive, accessible design built heavily with Tailwind CSS.

## Database Overview
The document-based MongoDB database consists of collections such as:
- `doctors`: Practitioner profiles, availability, and contact info.
- `appointments`: Transactional appointments linking patients to doctors.
- `settings`: Global system configurations and customizable time increments.

## Database Setup (MongoDB)

This project requires a MongoDB database to store appointments and practitioner data. You can either host this database locally or use MongoDB's managed cloud service, Atlas.

### Option A: Local MongoDB Setup

You can run MongoDB directly on your machine. Depending on your operating system, follow the specific instructions below:

#### Windows
1. Download the MongoDB Community Server (`.msi` installer) from the [MongoDB Download Center](https://www.mongodb.com/try/download/community).
2. Run the installer and choose the **Complete** setup type.
3. Ensure the **"Install MongoDB as a Service"** option is checked (this runs MongoDB automatically in the background).
4. Leave the **"Install MongoDB Compass"** option checked to install the GUI database manager.
5. Finish the installation.

#### macOS (via Homebrew)
1. Ensure you have [Homebrew](https://brew.sh/) installed.
2. Open your terminal and add the custom MongoDB tap:
   ```bash
   brew tap mongodb/brew
   ```
3. Install MongoDB Community Server:
   ```bash
   brew install mongodb-community@8.0
   ```
4. Start the MongoDB service to run continuously:
   ```bash
   brew services start mongodb-community@8.0
   ```
5. Install [MongoDB Compass](https://www.mongodb.com/products/tools/compass) separately as your GUI.

#### Linux (Ubuntu/Debian)
1. Import the MongoDB public GPG Key in your terminal:
   ```bash
   curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
      sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
   ```
2. Create the list file for MongoDB:
   ```bash
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
   ```
3. Reload the local package database and install MongoDB:
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```
4. Start and enable the MongoDB system service:
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```
5. Install [MongoDB Compass](https://www.mongodb.com/try/download/compass) using the provided `.deb` package.

#### Creating the Database (All Operating Systems)
1. Open **MongoDB Compass**.
2. Click the **Connect** button using the default local connection string: `mongodb://localhost:27017/`.
3. In the left sidebar, click the **+ (Create Database)** button.
4. Set the Database Name to `appointmentbook` and Collection Name to `appointments`. Leave all additional preferences unchecked and click **Create Database**. *(Note: MongoDB requires at least one collection to create a database. The other required collections, such as `doctors` and `settings`, will be automatically created by Mongoose when the application starts).*
5. Update your project's `.env.local` file with the connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/appointmentbook
   ```

### Option B: MongoDB Atlas Setup (Cloud & Recommended)
1. Navigate to [MongoDB Atlas](https://www.mongodb.com/atlas/database) and create a free account.
2. Build a new cluster using the **M0 Free** tier. Select your preferred cloud provider and region.
3. Once the cluster is provisioned, go to **Database Access** in the sidebar and click **Add New Database User**. Create a user with a strong password. Note these credentials.
4. Go to **Network Access** and click **Add IP Address**. You can select **Allow Access from Anywhere** (0.0.0.0/0) for development purposes, or whitelist your specific IP address for better security.
5. Go to **Database** under Deployment, and click the **Connect** button on your cluster.
6. Choose **Drivers** (Node.js) and copy the provided connection string.
7. Replace `<password>` with your database user's password and insert your desired database name before the `?retryWrites=true` query parameter.
8. Set your `.env.local` file `MONGODB_URI` variable to the copied string:
   `mongodb+srv://<username>:<password>@<cluster-url>.mongodb.net/appointmentbook?retryWrites=true&w=majority`

## Deployment Instructions

### Local Deployment
1. Install [Node.js](https://nodejs.org/) (v18+ recommended) on your machine.
2. Clone this repository into your chosen directory.
3. Open your terminal and run `npm install` to install all necessary dependencies.
4. Set up a MongoDB database (either locally or via [MongoDB Atlas](https://www.mongodb.com/atlas/database)).
5. Create a `.env.local` file in the root directory and add your connection string:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   ```
6. Start the development server by running `npm run dev`.
7. Access the application via a web browser at `http://localhost:3000`.

### Vercel Deployment
1. Push your project code to a GitHub repository.
2. Log into [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. In the project settings, configure the environment variables by adding your `MONGODB_URI`.
5. Deploy the application. Vercel will automatically build and host your Next.js project.

## AI Usage Acknowledgment
This project was originally developed in PHP as part of my VCE Software Development Project. The migration from PHP to a modern Next.js/TypeScript stack was undertaken with the assistance of AI-powered coding tools. AI was used to accelerate the rewrite process, including scaffolding components, generating boilerplate, implementing the role-based authentication system, and applying consistent dark mode styling across the application. All AI-generated code was reviewed, understood, and adapted to fit the project's architecture and requirements.

## Future Improvements & Learning

- [x] Add robust user authentication and role-based access
- [ ] Automate `.ics` calendar generation and email confirmations for clients
- [ ] Implement recurring appointment support
- [ ] Add analytics dashboard for practitioners
- [ ] Support multiple clinic locations
