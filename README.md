# Secure-Auth-API
Secure Auth API is a Node.js and Express-based authentication system that provides secure user authentication using JWT (JSON Web Token). It includes role-based access control (RBAC), refresh token handling, and admin seeding.


---
### 📌 **Secure API Authentication System**  
A **Node.js** authentication system with **JWT-based authentication**, **role-based access control (RBAC)**, and **refresh token rotation**.

---

## 🔧 **Features**  
✅ User Registration & Login  
✅ Password Hashing with `bcryptjs`  
✅ JWT Access & Refresh Token Authentication  
✅ Role-Based Access Control (RBAC)  
✅ Secure Logout with Refresh Token Revocation  
✅ Admin Seeding on Startup  

---

## 🚀 **Setup Instructions**  

### 1️⃣ **Clone the Repository**  
```bash
git clone https://github.com/YOUR_USERNAME/secure-auth-api.git
cd secure-auth-api
```

### 2️⃣ **Install Dependencies**  
```bash
npm install
```

### 3️⃣ **Create a `.env` File**  
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=3000
```

### 4️⃣ **Run the Server**  
```bash
npm start  # Or use nodemon src/app.js if using nodemon
```

✅ Server runs at `http://localhost:3000`

---

## 🔑 **API Endpoints**  

### **📌 Authentication Routes**  
| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/register` | Register a new user |
| **POST** | `/api/login` | Login and get JWT tokens |
| **POST** | `/api/refresh-token` | Get a new access token using a refresh token |
| **POST** | `/api/logout` | Logout and revoke refresh token |

📌 **Register Example:**  
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

📌 **Login Example Response:**  
```json
{
  "accessToken": "eyJhbGciOiJIUz...",
  "refreshToken": "eyJhbGciOiJIUz..."
}
```

---

### **📌 Protected Routes (Requires Authentication)**  
| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/protected` | Access a protected route (requires valid JWT) |
| **GET** | `/api/admin` | Access an admin-only route (requires admin role) |

🔹 **Authorization Header Format**  
```http
Authorization: Bearer <your_access_token>
```

---

## 🔐 **Role-Based Access Control (RBAC)**  
Users have **roles**:  
- `"user"` → Can access protected routes  
- `"admin"` → Can access `/api/admin`  

---

## 🛠 **How to Seed an Admin User**
On the first run, an **admin user is created** automatically:  
```json
{
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```
You can change this in **`src/app.js`**.

---

## 🛠 **Testing in Postman**  
1. **Register a User** (`POST /api/register`)  
2. **Login** (`POST /api/login`) → Get `accessToken`  
3. **Access Protected Route** (`GET /api/protected`) → Use `Authorization: Bearer <accessToken>`  
4. **Try Admin Route** (`GET /api/admin`)  
   - A **regular user** gets `403 Forbidden`.  
   - An **admin** can access it.  
5. **Refresh Token** (`POST /api/refresh-token`)  
6. **Logout** (`POST /api/logout`)  

---

## 📌 **Project Structure**  
```
secure-auth-api/
├── src/
│   ├── models/
│   │   └── User.js         # Mongoose user schema
│   ├── middleware/
│   │   ├── auth.js         # JWT authentication middleware
│   │   ├── checkRole.js    # Role-based access control
│   ├── routes/
│   │   └── authRoutes.js   # Authentication routes
│   ├── app.js              # Main app file
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

---

## 🎯 **Next Steps**
✅ Add OAuth Authentication (Google, GitHub)  
✅ Implement Email Verification  
✅ Store Refresh Tokens in HTTP-Only Cookies for better security  
