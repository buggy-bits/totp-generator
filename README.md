# TOTP Generator

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/) [![Node.js](https://img.shields.io/badge/Node.js-43853d?style=for-the-badge&logo=node-dot-js&logoColor=white)](https://nodejs.org/) [![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/) [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

---

A free, minimal **TOTP (Time-based One-Time Password) Generator**.  
This app lets you add and manage secrets, generate secure OTPs, and view them with a sleek timer interface – all stored safely in your browser.

<div align="center" style=" display: flex;">
<figure style="width: 50%;">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/diagrams/HLD-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="assets/diagrams/HLD-light.png" />
    <img src="assets/diagrams/HLD-light.png" alt="HLD Diagram" />
  </picture>
  <figcaption><p>High Level Design</p></figcaption>
</figure>

<figure style="width: 50%; ">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/diagrams/sequence-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="assets/diagrams/HLD-light.png" />
    <img src="assets/diagrams/sequence-light.png" alt="HLD Diagram" />
  </picture>
  <figcaption><p>Sequence Diagram</p></figcaption>
</figure>
</div>

## Screenshots

<div align="center" style="margin-top: 10px;margin-bottom: 10px; display: flex; justify-content: center;">

<figure>
  <img src="assets/screenshots/homepage.png" alt="HomePage">
  <figcaption><p>Homepage</p></figcaption>
</figure>

<figure>
  <img src="assets/screenshots/otp.png" alt="OTPpage" >
  <figcaption><p>Dedicated Otp page</p></figcaption>
</figure>
  </div>

## How It Works

Time-based OTPs (TOTP) are generated using the **HMAC-SHA1 hashing algorithm** combined with the current time.

- The secret key (Base32 encoded) shared between client and server is combined with the current Unix timestamp.
- The timestamp is divided into discrete intervals (typically 30 seconds).
- Using HMAC-SHA1, the secret and this time interval are hashed to generate a numeric code.
- The output is truncated to produce a short 6-digit one-time password.

This approach ensures that the OTP is valid only for the current time window and changes in sync across systems that share the same secret.

## Features

- **Secure OTP Generation** using TOTP algorithm
- **Add new secrets** via form input (QR upload planned for future)
- **OTP Dashboard** with:
  - Current OTP code
  - Countdown timer (auto-refresh on expiry)
  - Minimal timer representation (circular/linear)
- **Manage Entries**:
  - Update issuer/secret securely (secret never exposed in frontend)
  - Delete entries as needed
  - Persistent entry IDs stored in LocalStorage
- **Entry Sidebar**: Quickly switch between saved OTP entries
- **Dark Mode UI** with a clean, readable tech font

---

## Tech Stack

### Backend

- Node.js + Express
- MongoDB (Mongoose)
- TOTP generation + CRUD APIs

### Frontend

- Vite + React
- React Router v6
- TailwindCSS
- LocalStorage for saved IDs

## Contributing

### Prerequisites

- Node.js (>= 18)
- MongoDB

### Fork & Clone

```
git clone https://github.com/<your-username>/totp-generator.git
cd totp-generator
```

### Install Dependencies

```
npm install
```

### Run the app

```
npm run dev
```

### Using Docker for MongoDB

```
cd totp-generator
docker-compose up -d
```

### License

MIT License © 2025 Gadangi Sainag ☺️
