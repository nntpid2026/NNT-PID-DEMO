# MERN Stack Universal Architecture & Guidelines (Prompt for AI)

> **AI INSTRUCTION**: Whenever working on a MERN stack project, ALWAYS adhere strictly to the architecture, guidelines, folder structures, and coding practices defined in this document. Do not deviate unless explicitly asked by the user.

## 1. Project Initialization & Dependencies

### Backend Stack & Dependencies
- **Core**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Security & Auth**: `bcryptjs`, `jsonwebtoken` (JWT), `cors`, `helmet`, `cookie-parser`
- **Validation**: `zod` or `joi`
- **Logging & Utilities**: `morgan`, `dotenv`
- **Setup**: Use ES Modules (`"type": "module"` in `package.json`).

### Frontend Stack & Dependencies
- **Core**: React 19, Vite (`@vitejs/plugin-react`), React Router DOM
- **Styling**: TailwindCSS, Framer Motion, React Icons
- **State/API**: Custom Fetch wrapper / Axios, React Hot Toast (for notifications)
- **Offline/Local DB (if applicable)**: Dexie (IndexedDB)

---

## 2. Global Folder Structure

### Backend (`server/`)
```text
server/
├── scripts/            # Build/Automation scripts
├── src/
│   ├── config/         # DB connection, Env var validation
│   ├── controllers/    # Request handling, response formatting (No heavy logic)
│   ├── middlewares/    # Auth, Error handling, Rate limiting, Validation
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers (mapping endpoints to controllers)
│   ├── services/       # Core business logic (DB calls, external APIs)
│   ├── utils/          # Helpers (e.g., custom error classes, token generation)
│   ├── app.js          # Express app setup (middlewares, route mounting)
│   └── server.js       # Server initialization (listen to port)
├── .env.example
└── package.json
```

### Frontend (`client/`)
```text
client/
├── src/
│   ├── assets/         # Images, global static files
│   ├── components/     # Reusable UI components (Buttons, Modals, Layouts)
│   ├── config/         # Frontend configs, constants
│   ├── context/        # Global State / Context Providers
│   ├── hooks/          # Custom React Hooks (Business logic for components)
│   ├── pages/          # Page components (Mapped to Routes)
│   ├── services/       # API abstraction, external calls
│   │   ├── api.js      # Base fetch/axios wrapper (interceptors, auth)
│   │   └── *.service.js# Specific services (e.g., auth.service.js)
│   ├── utils/          # Formatting, helpers
│   ├── App.jsx         # Main routing
│   └── main.jsx        # React DOM render
├── index.css           # Tailwind imports & global styles
└── package.json
```

---

## 3. Coding Guidelines & Separation of Concerns

### A. Backend Separation
1. **Routes**: ONLY map paths to controller functions.
2. **Controllers**: Handle HTTP Requests & Responses. Extract `req.body`, `req.params`, pass them to `Services`, and send back `res.status().json()`. **No DB operations directly in controllers.**
3. **Services**: Contains the actual business logic. Connects to `Models`, formats data, and throws custom errors if something goes wrong.
4. **Middlewares**: Use for global error handling (`errorHandler`), JWT verification (`protect`), and route validations.

### B. Frontend Separation & API Calls
1. **`services/api.js`**: Create a custom fetch (or axios) wrapper. Handle token injection (Bearer / Cookies), base URL setup, and global error handling (e.g., 401 Unauthorized redirects) here.
2. **`services/<name>.service.js`**: Create specific API services that export functions calling the `api.js` wrapper. Example: `auth.service.login(credentials)`.
3. **Hooks (`hooks/`)**: Write custom hooks (e.g., `useDashboard.js`) to handle component state, loading states, and side effects. Call the `services` from inside these hooks.
4. **Components/Pages (`pages/` & `components/`)**: Keep UI components clean. They should primarily consume data from hooks or context and render HTML/Tailwind.

---

## 4. Production & Best Practices

- **Environment Variables**: Never hardcode secrets. Always use `.env` and validate them on startup.
- **Error Handling**: Use a centralized global error handler in the backend. In the frontend, handle UI notifications globally (e.g., via `react-hot-toast` in `api.js`).
- **Security**: Always use `helmet` for HTTP headers, `cors` configured for specific origins, and `express-rate-limit` for DDOS protection.
- **Code Style**: 
  - Use modular, reusable code.
  - Follow camelCase for variables/functions and PascalCase for React components/Models.
  - Write descriptive, clean code and avoid deeply nested callbacks (use Async/Await).
