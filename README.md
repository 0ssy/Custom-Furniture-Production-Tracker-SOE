# Custom Furniture Production Tracker – Backend

## 1. Project Overview

The Custom Furniture Production Tracker is a software system designed to manage furniture production activities.

The backend handles application logic, database operations, authentication, authorization and communication between the frontend and the database.

It provides RESTful API endpoints for managing customers, furniture, materials, orders, payments, production records and deliveries.

## 2. Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime environment |
| TypeScript | Backend programming language |
| Express.js | Web application framework |
| MongoDB | Database management |
| Mongoose | MongoDB object modelling |
| JSON Web Token (JWT) | User authentication |
| bcryptjs | Password hashing |
| dotenv | Environment variable management |
| CORS | Cross-Origin Resource Sharing |
| Vitest | Automated testing |
| Postman | API testing |
| tsx | TypeScript development execution |

## 3. Backend Features

The backend includes the following modules:

- **Authentication:** User registration, login and token-based authentication.
- **Customer Management:** Create, retrieve, update and delete customer records.
- **Furniture Management:** Manage furniture information and availability.
- **Material Management:** Manage materials used in furniture production.
- **Order Management:** Create and manage customer orders.
- **Payment Management:** Record and manage payments associated with orders.
- **Production Management:** Track production records and production status.
- **Delivery Management:** Manage delivery information associated with orders.

## 4. Authentication and Authorization

The backend implements authentication using JSON Web Tokens (JWT).

Passwords are hashed using bcryptjs before being stored in the database.

Role-based authorization is implemented to distinguish between Staff and Admin users.

- Users must authenticate before accessing protected endpoints.
- Staff users can perform permitted operations.
- Restricted operations, such as record deletion, require Admin permissions.

## 5. Project Structure

```text
backend/
│
├── src/
│   ├── config/
│   │   └── db.ts
│   │
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── customerController.ts
│   │   ├── deliveryController.ts
│   │   ├── furnitureController.ts
│   │   ├── materialController.ts
│   │   ├── orderController.ts
│   │   ├── paymentController.ts
│   │   └── productionController.ts
│   │
│   ├── middleware/
│   │   └── authMiddleware.ts
│   │
│   ├── models/
│   │   ├── Customer.ts
│   │   ├── Delivery.ts
│   │   ├── Furniture.ts
│   │   ├── Material.ts
│   │   ├── Order.ts
│   │   ├── Payment.ts
│   │   ├── Production.ts
│   │   └── User.ts
│   │
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── customerRoutes.ts
│   │   ├── deliveryRoutes.ts
│   │   ├── furnitureRoutes.ts
│   │   ├── materialRoutes.ts
│   │   ├── orderRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   └── productionRoutes.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── tests/
│   └── app.test.ts
│
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── README.md
│
└── DevLog.md
```

*The structure above shows the main application files. The other development logs are also maintained in the backend directory.*

## 6. Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB
- Git

### Clone the Repository

```bash
git clone https://github.com/0ssy/Custom-Furniture-Production-Tracker-SOE.git
```

Navigate to the backend directory:

```bash
cd Custom-Furniture-Production-Tracker-SOE/backend
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following configuration:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/furniture_production_tracker
JWT_SECRET=your_secret_key
```

Use a secure private JWT secret. Do not commit the `.env` file to GitHub.

### Run the Development Server

```bash
npm run dev
```

## 7. Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server using tsx watch |
| `npm run build` | Compiles the TypeScript application |
| `npm start` | Runs the compiled application |
| `npm run typecheck` | Checks TypeScript for errors |
| `npm test` | Runs automated tests |
| `npm run test:watch` | Runs tests in watch mode |

## 8. Testing

The backend was tested using Postman and Vitest.

Testing covered:

- Customer management.
- Furniture management.
- Material management.
- Order management.
- Payment management.
- Production management.
- Delivery management.
- User registration and login.
- Protected API endpoints.
- Staff and Admin permissions.

### Verification Results

| Verification | Result |
|---|---|
| Manual API testing using Postman | Completed successfully |
| Authentication testing | Passed |
| Authorization testing | Passed |
| TypeScript type checking | Passed |
| Production build | Passed |
| Automated home-route test | 1 passed, 0 failed |

Refer to `Testing.md` for the detailed system testing documentation.

## 9. Development Documentation

The backend development process is documented through the following development logs:

- DevLog.md
- DevLog2.md
- DevLog3.md
- DevLog4.md
- DevLog5.md
- DevLog6.md
- DevLog7.md

These documents record implementation progress, technical decisions, challenges encountered and solutions applied during development.

## 10. Current Development Status

**Backend development: Completed**

The backend modules have been implemented and tested. Authentication, authorization, database connectivity and API functionality have been verified.

The backend is ready for integration with the frontend application.

---

**Project:** Custom Furniture Production Tracker
**Component:** Backend
**Repository:** Custom-Furniture-Production-Tracker-SOE