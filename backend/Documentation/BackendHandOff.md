# Backend Handover Documentation
## Custom Furniture Production Tracker

**Project:** Custom Furniture Production Tracker  
**Component:** Backend  
**Language:** TypeScript  
**Framework:** Node.js and Express.js  
**Database:** MongoDB  
**Branch:** `backend`

---

## 1. Introduction

This document provides the information required to integrate the Custom Furniture Production Tracker backend with the frontend application.

The backend provides the API endpoints, database operations, application logic, authentication and authorization required by the system.

The frontend will communicate with the backend through HTTP requests and receive JSON responses.

The backend has eight main areas of functionality:

1. Authentication
2. Customer management
3. Furniture management
4. Material management
5. Order management
6. Payment management
7. Production management
8. Delivery management

## 2. Backend Technologies

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| TypeScript | Programming language |
| MongoDB | Database |
| Mongoose | Database modelling |
| JWT | Authentication |
| bcryptjs | Password hashing |
| dotenv | Environment configuration |
| CORS | Frontend-backend communication |
| Vitest | Automated testing |

## 3. Project Structure

The backend is organised into the following main directories:

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
├── package.json
└── tsconfig.json
```

### Folder responsibilities

- **config:** Database connection configuration.
- **controllers:** Handle requests, application logic and responses.
- **middleware:** Authentication and permission verification.
- **models:** Define MongoDB document structures.
- **routes:** Define API endpoints and connect them to controllers.
- **app.ts:** Configure Express and register routes.
- **server.ts:** Start the backend server and database connection.

## 4. Running the Backend

### Requirements

- Node.js
- npm
- MongoDB

### Installation

Clone the repository:

```bash
git clone https://github.com/0ssy/Custom-Furniture-Production-Tracker-SOE.git
```

Navigate to the backend:

```bash
cd Custom-Furniture-Production-Tracker-SOE/backend
```

Install dependencies:

```bash
npm install
```

### Environment configuration

The backend uses environment variables for its configuration.

The project currently uses a root-level `.env` file.

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/furniture_production_tracker
JWT_SECRET=your_secret_key
```

The actual JWT secret must remain private.

### Start the development server

```bash
npm run dev
```

The local API base URL is:

```text
http://localhost:5000
```

## 5. API Communication

The frontend communicates with the backend using HTTP requests.

The main HTTP methods are:

| Method | Purpose |
|---|---|
| GET | Retrieve information |
| POST | Create new records or authenticate users |
| PUT | Update existing records |
| DELETE | Delete records where the user's role permits it |

Requests containing data should use JSON:

```http
Content-Type: application/json
```

The frontend should process JSON responses and display suitable success or error messages.

## 6. API Endpoint Reference

The following is the endpoint integration map. The `/api` resource prefixes should be checked against the route registrations in `src/app.ts` before the frontend hardcodes them.

### 6.1 Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |

Registration and login are the two confirmed authentication routes.

### 6.2 Customer Management

Resource prefix: `/api/customers`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/customers` | Create a customer |
| GET | `/api/customers` | Retrieve all customers |
| GET | `/api/customers/:id` | Retrieve a customer |
| PUT | `/api/customers/:id` | Update a customer |
| DELETE | `/api/customers/:id` | Delete a customer |

### 6.3 Furniture Management

Resource prefix: `/api/furniture`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/furniture` | Create furniture |
| GET | `/api/furniture` | Retrieve all furniture |
| GET | `/api/furniture/:id` | Retrieve furniture by ID |
| PUT | `/api/furniture/:id` | Update furniture |
| DELETE | `/api/furniture/:id` | Delete furniture |

### 6.4 Material Management

Resource prefix: `/api/materials`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/materials` | Create material |
| GET | `/api/materials` | Retrieve all materials |
| GET | `/api/materials/:id` | Retrieve material by ID |
| PUT | `/api/materials/:id` | Update material |
| DELETE | `/api/materials/:id` | Delete material |

### 6.5 Order Management

Resource prefix: `/api/orders`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/orders` | Create an order |
| GET | `/api/orders` | Retrieve all orders |
| GET | `/api/orders/:id` | Retrieve an order |
| PUT | `/api/orders/:id` | Update an order |
| DELETE | `/api/orders/:id` | Delete an order, subject to permissions |

Orders reference customers and furniture records.

The order functionality includes quantities, unit prices, total amounts, order status and expected delivery dates.

### 6.6 Payment Management

Resource prefix: `/api/payments`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/payments` | Create a payment |
| GET | `/api/payments` | Retrieve all payments |
| GET | `/api/payments/:id` | Retrieve a payment |
| PUT | `/api/payments/:id` | Update a payment |
| DELETE | `/api/payments/:id` | Delete a payment, subject to permissions |

Payments are associated with existing orders.

The tested payment workflow included Mobile Money, an amount of 5000, a transaction reference and a payment status.

### 6.7 Production Management

Resource prefix: `/api/production`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/production` | Create a production record |
| GET | `/api/production` | Retrieve production records |
| GET | `/api/production/:id` | Retrieve a production record |
| PUT | `/api/production/:id` | Update production information |
| DELETE | `/api/production/:id` | Delete a production record, subject to permissions |

Production records reference orders.

The tested production workflow included the statuses:

- Not Started
- In Progress

### 6.8 Delivery Management

Resource prefix: `/api/deliveries`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/deliveries` | Create a delivery |
| GET | `/api/deliveries` | Retrieve all deliveries |
| GET | `/api/deliveries/:id` | Retrieve a delivery |
| PUT | `/api/deliveries/:id` | Update delivery information |
| DELETE | `/api/deliveries/:id` | Delete a delivery, subject to permissions |

Delivery records are associated with orders and include delivery address and delivery date information.

---

## 7. Authentication and Authorization

The backend uses JSON Web Tokens (JWT) to authenticate users.

### Registration

The frontend sends user registration information to:

```http
POST /api/auth/register
```

The backend creates the user account and hashes the password before saving it.

### Login

The frontend sends login credentials to:

```http
POST /api/auth/login
```

When authentication succeeds, the backend returns an authentication token.

The frontend must retain the token securely and use it when making requests to protected endpoints.

### Sending the token

Protected requests should include:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Example:

```javascript
const response = await fetch(
  "http://localhost:5000/api/customers",
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }
);
```

### Authentication responses

| HTTP Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 401 | Authentication required or invalid |
| 403 | Authenticated user lacks permission |
| 404 | Requested resource not found |
| 500 | Internal server error |

The frontend should handle these responses appropriately.

## 8. User Roles and Permissions

The backend supports two user roles:

### Staff

Staff users can perform permitted operations, including creating records and accessing protected resources.

Staff users are restricted from administrative deletion operations.

### Admin

Admin users have additional permissions, including deletion operations restricted to administrators.

### Permission summary

| Operation | Staff | Admin |
|---|---|---|
| Register and log in | Yes | Yes |
| Access protected endpoints | Yes | Yes |
| Create permitted records | Yes | Yes |
| Retrieve records | Yes | Yes |
| Update permitted records | Yes | Yes |
| Perform restricted deletion | No | Yes |

The frontend should use the authenticated user's role to control which actions and interface elements are displayed.

**Important:** Hiding a button in the frontend is not a security mechanism. The backend remains responsible for enforcing permissions.

## 9. Data Relationships

The system uses MongoDB references to connect related records.

The main relationships include:

- Customers can have multiple orders.
- Orders reference customers.
- Orders reference furniture items.
- Payments reference orders.
- Production records reference orders.
- Delivery records reference orders.

Some GET responses populate related records. For example, order retrieval was tested with populated customer and furniture information.

The frontend should account for related information when displaying order, payment, production and delivery details.

## 10. Frontend Integration Guidelines

The frontend developer should consider the following when integrating the backend.

### Centralised API configuration

Create a central API configuration file rather than repeating the backend URL throughout the application.

Example:

```javascript
const API_BASE_URL = "http://localhost:5000";

export default API_BASE_URL;
```

### Reusable request handling

Create reusable functions for communicating with the backend.

These functions should:

- Set the correct HTTP method.
- Send JSON request bodies when required.
- Attach the JWT token to protected requests.
- Process JSON responses.
- Handle unsuccessful responses.
- Display appropriate error messages.

### Authentication state

The frontend should maintain the user's authentication state.

After successful login:

1. Receive the token from the backend.
2. Retain the token securely.
3. Include it in protected requests.
4. Handle expired or invalid authentication.
5. Provide a logout mechanism.

### Data display

The frontend should display information returned by the backend rather than relying on hardcoded sample records.

For example:

- Customer lists should use customer API responses.
- Furniture listings should use furniture API responses.
- Order pages should retrieve actual order records.
- Payment pages should display payment information.
- Production pages should display production statuses.
- Delivery pages should display delivery information.

### Error handling

The frontend should handle common API errors, including:

- Invalid login credentials.
- Missing authentication tokens.
- Insufficient permissions.
- Invalid or missing record IDs.
- Server errors.
- Database or network connection problems.

---

## 11. Testing and Verification

The backend has undergone manual and automated testing.

### Manual testing

Postman was used to test the seven functional modules:

- Customer
- Furniture
- Material
- Orders
- Payments
- Production
- Delivery

Authentication and authorization were also tested.

### Automated testing

The existing Vitest test was executed successfully.

| Test | Result |
|---|---|
| API home-route test | Passed |
| Failed automated tests | 0 |

### Additional verification

| Verification | Result |
|---|---|
| TypeScript type checking | Passed |
| Production build | Passed |
| Manual API testing | Completed successfully |
| Authentication | Passed |
| Authorization | Passed |

Detailed test results are documented in `Testing.md`.

## 12. Development Commands

Run these commands from the backend directory.

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run typecheck` | Check TypeScript errors |
| `npm test` | Run automated tests |
| `npm run build` | Compile the backend |
| `npm start` | Start compiled application |

## 13. Important Integration Notes

1. The backend must be running before the frontend can communicate with it.
2. MongoDB must be available.
3. The frontend must use the correct backend API base URL.
4. Protected requests must include a valid JWT.
5. The frontend must respect Staff and Admin permissions.
6. Related records should use the IDs returned by the backend.
7. The frontend should handle loading states and API errors.
8. The frontend should not expose database credentials or JWT secrets.
9. Endpoint prefixes and request fields must match the actual route registrations, controllers and Mongoose models.

## 14. Repository

GitHub repository:

https://github.com/0ssy/Custom-Furniture-Production-Tracker-SOE

Backend branch:

https://github.com/0ssy/Custom-Furniture-Production-Tracker-SOE/tree/backend

Backend source:

https://github.com/0ssy/Custom-Furniture-Production-Tracker-SOE/tree/backend/backend

## 15. Handover Summary

The backend development work covers all seven functional modules, user authentication, role-based authorization, MongoDB integration and REST API functionality.

Manual API testing, automated testing, TypeScript verification and production build verification have been completed successfully.

The backend is ready for frontend integration and joint system testing.

**Prepared for:** Frontend development and integration  
**Project:** Custom Furniture Production Tracker  
**Component:** Backend
