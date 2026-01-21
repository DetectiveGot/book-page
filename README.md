# Book Page
A book listing and bookmarking web application built with Next.js, Auth0 and MongoDB. This project was built for learning purposes to explore authentication integrated with a database. 

## Features
- Browse books with pagination
- User authentication with Auth0
- Bookmarking system

## Tech Stack
- **Frontend**
    - Next.js
    - Typescript
- **Backend**
    - Next.js API Routes
- **Database**
    - MongoDB + Mongoose (Schema definitions are maintained in `src/models`)
- **Authentication**
    - Auth0
- **Stlying**
    - Tailwindcss
    - Shadcn/ui
    - Lucide Icons

## Getting started

### Prerequisites
- Node js
- pnpm
- MongoDB
- Auth0 account

### Environment Variables
Create an `.env.local` file:
```env
APP_BASE_URL=http://localhost:3000
AUTH0_SECRET=your_secret_here
AUTH0_DOMAIN=your_auth0_domain
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
MONGODB_URI=your_mongodb_uri
```

## Installation
```bash
git clone https://github.com/DetectiveGot/book-page.git
cd book-page
pnpm i
pnpm run dev
```