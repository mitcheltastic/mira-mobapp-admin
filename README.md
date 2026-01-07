# Mira MobApp Admin

A backend API server for the admin panel of the Mira mobile application. This project provides administrative functionalities such as user management, subscription handling, community management, and data export capabilities.

## Features

- **Admin Authentication**: Register, login, logout, and manage admin accounts with JWT-based authentication.
- **User Management**: View, delete, and manage user profiles.
- **Subscription Management**: Handle user subscriptions and related operations.
- **Community Management**: Manage community-related features and data.
- **Dashboard**: Provide dashboard data and analytics.
- **Excel Export**: Export data to Excel files for reporting.
- **File Upload**: Support for file uploads using Multer.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JSON Web Tokens (JWT) with bcrypt for password hashing
- **File Handling**: Multer for file uploads, xlsx for Excel operations
- **Deployment**: Vercel (Serverless)
- **Development**: Nodemon for hot reloading

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mitcheltastic/mira-mobapp-admin.git
   cd mira-mobapp-admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Ensure you have a Supabase project set up with the necessary tables (e.g., `profiles`, `admins`, etc.).

## Usage

### Development
Run the server in development mode with hot reloading:
```bash
npm run dev
```

### Production
Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000` by default, or the port specified in the `PORT` environment variable.

## API Endpoints

### Admin Authentication
- `POST /api/admin/register` - Register a new admin
- `POST /api/admin/login` - Login admin
- `GET /api/admin/whoami` - Get current admin info (protected)
- `POST /api/admin/logout` - Logout admin (protected)
- `DELETE /api/admin/:id` - Delete admin (protected)
- `GET /api/admin/list` - Get list of admins (protected)

### User Management
- `GET /api/admin/users` - Get list of users (protected)
- `DELETE /api/admin/users/:id` - Delete a user (protected)

### Subscription Management
- Additional endpoints for subscription handling (refer to routes for details)

### Community Management
- Endpoints for community features (refer to routes for details)

### Dashboard
- `GET /api/dashboard/*` - Dashboard-related endpoints

### Excel Export
- Endpoints for exporting data to Excel

All protected routes require a valid JWT token in the Authorization header.

## Project Structure

```
mira-mobapp-admin/
├── src/
│   ├── app.js                 # Main Express app setup
│   ├── server.js              # Server entry point
│   ├── config/
│   │   └── supabase.js        # Supabase client configuration
│   ├── controllers/           # Route handlers
│   │   ├── adminController.js
│   │   ├── usersController.js
│   │   ├── subscriptionController.js
│   │   ├── communityController.js
│   │   ├── dashboardController.js
│   │   └── excelController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # Authentication middleware
│   └── routes/                # Route definitions
│       ├── adminRoutes.js
│       └── dashboardRoutes.js
├── package.json
├── vercel.json                # Vercel deployment configuration
└── README.md
```

## Deployment

This project is configured for deployment on Vercel as a serverless function. The `vercel.json` file handles the build and routing configuration.

To deploy:
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the project root
3. Follow the prompts to link your Vercel account and deploy

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Repository

[GitHub Repository](https://github.com/mitcheltastic/mira-mobapp-admin)