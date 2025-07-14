# Express Application Overview

This document provides an overview of the Express application, including its middleware, routes, and WebSocket server configuration.

## Setup

To get started with this Express application, follow the steps below:

1. **Clone the Repository**

    Begin by cloning the repository to your local machine:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Configure Environment Variables**

    Create a `.env` file in the project root and define the following environment variables required for application setup:

    - `DATABASE_URL`: Connection string for your PostgreSQL database.
    - `PORT`: Port number for the Express server.
    - `ACCESS_TOKEN_SECRET`: Secret key for signing access tokens.
    - `REFRESH_TOKEN_SECRET`: Secret key for signing refresh tokens.
    - `ACCESS_TOKEN_EXPIRY`: Expiry duration for access tokens.
    - `REFRESH_TOKEN_EXPIRY`: Expiry duration for refresh tokens.

    **Note:** Do not share sensitive values publicly. Refer to your deployment documentation for recommended values.

3. **Install Dependencies**

    Install all required dependencies using npm:

    ```bash
    npm install
    ```

4. **Database Setup**

    Generate the necessary database tables using Prisma migrations:

    ```bash
    npx prisma migrate dev
    ```

    To enable working with raw SQL queries, generate Prisma client with SQL support:

    ```bash
    npx prisma generate --sql
    ```

5. **Initial Application Setup**

    Execute the setup script to initialize essential configurations:

    ```bash
    npm run setup
    ```

6. **Start the Development Server**

    You can now launch the application in development mode:

    ```bash
    npm run devStart
    ```

After completing these steps, your application environment will be fully configured and ready for development and testing.

## Features

### Middleware

- **CORS**: Configured to allow requests from `http://localhost:4200`(for development) with credentials.
- **JSON Parsing**: Enables parsing of JSON payloads.
- **Cookie Parsing**: Parses cookies attached to client requests.

### Routes

The application defines HTTP routes for various entities:

- **Super Admin**: `/superAdmin` - Handles super admin functionality.
- **User**: `/user` - Handles user functionality.
- **Department**: `/department` - Handles department functionality.
- **Course**: `/course` - Handles course functionality.
- **Program**: `/program` - Handles program functionality.
- **Student Batch**: `/studentBatch` - Handles student batch functionality.
- **Grade Level**: `/gradeLevel` - Handles grade level functionality.
- **Academic Year**: `/academicYear` - Handles academic year functionality.
- **Academic Term**: `/academicTerm` - Handles academic term functionality.
- **Student Group**: `/studentGroup` - Handles student group functionality.
- **Student**: `/student` - Handles student functionality.
- **Instructor**: `/instructor` - Handles instructor functionality.
- **Admin**: `/admin` - Handles admin functionality.

### WebSocket Server

- **Authentication**: Uses `verifyAccessTokenWebSocket` middleware for WebSocket authentication.
- **Connection Handling**: Manages WebSocket connections via the `onConnection` callback.

## Dependencies

The application relies on the following packages:

- **dotenv**: Loads environment variables from a `.env` file.
- **cors**: Enables Cross-Origin Resource Sharing.
- **express**: Web framework for building HTTP APIs.
- **cookie-parser**: Parses cookies attached to client requests.
- **socket.io**: Enables real-time communication via WebSockets.
