# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Grabi Admin Dashboard

A React-based admin dashboard for managing users and viewing usage statistics.

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd server
   npm install
   cd ..
   ```
3. Create a `.env` file in the root directory with:
   ```
   VITE_API_URL=http://localhost:3001/api/admin
   ```
4. Start the development servers:
   ```
   npm run dev
   ```

## Deployment to Netlify

### Frontend Deployment

1. Create a Netlify account if you don't have one
2. Connect your GitHub repository to Netlify
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in Netlify:
   - `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend-url.com/api/admin`)

### Backend Deployment

The backend needs to be deployed separately to a hosting service that supports Node.js applications, such as:
- Heroku
- Render
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

After deploying the backend, update the `VITE_API_URL` environment variable in Netlify to point to your deployed backend URL.

## Features

- User management (create, edit, delete)
- Password reset functionality
- Usage statistics
- User login activity tracking
- Responsive design
