# Basic-Social-Media-Nextjs
Incognitor is a privacy-focused social media web application built with Next.js for the frontend and Laravel as the backend API. Designed to empower users to share thoughts freely and anonymously, it emphasizes mental wellness and digital safety in an era of overexposure.

The app uses Typesense, an open-source typo-tolerant search engine, to power real-time and privacy-respecting search functionality—making anonymous posts discoverable without compromising user identity.

Key features include:
    Anonymous posting without linking to real-world identity
    User authentication with secure account creation
    A feed of posts with optional filters and keyword search
    Integration with Typesense for fast, relevant, and SEO-friendly search indexing
    RESTful API endpoints powered by Laravel for scalability and maintainability
    Responsive, modern UI built with Tailwind CSS and Next.js

This stack balances speed, privacy, and searchability, making Incognitor a safe space for users to express thoughts without fear or digital footprint.

🛠 Tech Stack
Layer	Technology
Frontend	Next.js, Tailwind CSS
Backend API	Laravel (RESTful)
Search	Typesense
Database	MySQL / SQLite (configurable)
Auth	JWT / Session-based (configurable)

📂 Folder Structure
Each major directory includes its own README.md file to guide developers:
/frontend     # Next.js app - includes setup, usage & deployment steps
/backend      # Laravel API - includes environment config, routes & DB setup