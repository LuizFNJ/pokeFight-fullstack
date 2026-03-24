# ⚡ PokeCollector - Fullstack Challenge

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

This project was developed as a solution to a Fullstack technical challenge. The main objective was to consume the PokeAPI to create a Pokémon search dashboard, implementing a custom authentication system from scratch to protect specific routes.

## 🎯 Challenge Requirements Completed

### Challenge 1: API Consumption & Interface

- [x] Create a backend API to consume and filter data from the PokeAPI.
- [x] Create a frontend to display Pokémon cards with their respective images.
- [x] Build the application without opinionated frameworks like NestJS or Next.js.
- [x] Implement search filters (by name and type).

### Challenge 2: Authentication & Database

- [x] Connect the application to a database (MongoDB).
- [x] Create an authentication system (Registration and Login).
- [x] Restrict the use of search filters exclusively to logged-in users.

---

## 🛠️ Technologies Used

**Frontend:**

- React (via Vite)
- Tailwind CSS v4 (Responsive styling and TCG-like UI)
- Axios (HTTP requests)
- React Router Dom (Navigation)
- Custom Observer Pattern (Global non-blocking notification system)

**Backend:**

- Node.js with Express (Layered Architecture)
- MongoDB & Mongoose (Database and Modeling)
- JWT (JSON Web Tokens for route protection)
- bcryptjs (Password hashing)

**Tooling:**

- Concurrently (Run fullstack environment with a single command)

---

## 🚀 How to Run the Project Locally

### 1. Clone the repository

```bash
git clone [https://github.com/YOUR_USERNAME/pokecollector-fullstack.git](https://github.com/YOUR_USERNAME/pokecollector-fullstack.git)
cd pokecollector-fullstack
```

### 2. Create .env

Create a `.env` file inside the `backend` folder with the following variables:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/pokeauth
JWT_SECRET=your_super_secret_jwt_key_here
```

### 3. Install Dependencies & Run

Install all dependencies for the root workspace, backend, and frontend with a single command from the **root folder**:

```bash
npm install
```

To run in dev mode

```sh
yarn dev
```

Access <http://localhost:5173> in your browser.
