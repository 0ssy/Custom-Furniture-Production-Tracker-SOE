# DevLog5 – Customer and Furniture Modules

**Project:** Custom Furniture Production Tracker  
**Date:** 3 November 2026  
**Area:** Backend Development  
**Technologies:** Node.js, Express, TypeScript, MongoDB and Mongoose

---

## 1. Objective

The objective of this development session was to begin implementing the main backend modules for the Custom Furniture Production Tracker.

The planned work was to build four modules today, including their database models and controllers, and complete the remaining modules tomorrow.

The first two modules worked on were:

1. Customer Management
2. Furniture Management

## 2. Customer Module

### 2.1 Customer Model

The Customer model was created in:

`backend/src/models/Customer.ts`

The model defines the following fields:

| Field | Data type | Purpose |
|---|---|---|
| fullName | String | Customer's full name |
| email | String | Customer's email address |
| phone | String | Customer's phone number |
| address | String | Customer's address |
| createdAt | Date | Automatically records creation time |
| updatedAt | Date | Automatically records update time |

Business rules implemented:

- All four customer fields are required.
- Email addresses are stored in lowercase.
- Leading and trailing whitespace is removed.
- Customer email addresses must be unique.
- Mongoose timestamps are enabled.

### 2.2 Customer Controller

Created:

`backend/src/controllers/customerController.ts`

The `createCustomer` controller was implemented to:

- Receive customer details from an HTTP request.
- Check that all required fields are provided.
- Check whether the email address already exists.
- Create and save a customer in MongoDB.
- Return appropriate HTTP responses.
- Handle duplicate email and unexpected errors.

### 2.3 Customer Routes

Created:

`backend/src/routes/customerRoutes.ts`

The registration endpoint was configured:

`POST /api/customers`

The customer router was also registered in `app.ts`.

### 2.4 Customer Development Status

The Customer model and controller were created, and TypeScript checking was successful after the Customer route integration.

The module still requires more comprehensive endpoint testing, including successful registration, duplicate email handling and incomplete submissions.

---

## 3. Furniture Module

### 3.1 Furniture Model

Created:

`backend/src/models/Furniture.ts`

The model contains the following fields:

| Field | Data type | Purpose |
|---|---|---|
| name | String | Furniture name |
| description | String | Furniture description |
| category | String | Furniture category |
| basePrice | Number | Starting price |
| dimensions | Object | Length, width and height |
| isAvailable | Boolean | Furniture availability |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Update timestamp |

Business rules implemented:

- Furniture name, description, category and base price are required.
- Categories are restricted to Chair, Table, Bed, Sofa, Cabinet and Other.
- Base price cannot be negative.
- Dimensions contain length, width and height.
- Availability defaults to true.
- Mongoose timestamps are enabled.

The Furniture model passed TypeScript checking without errors.

### 3.2 Furniture Controller

Created:

`backend/src/controllers/furnitureController.ts`

Five controller operations were implemented:

1. `createFurniture` – creates a furniture record.
2. `getAllFurniture` – retrieves all furniture records.
3. `getFurnitureById` – retrieves a specific record.
4. `updateFurniture` – updates an existing record.
5. `deleteFurniture` – deletes a record.

The controller includes error handling and checks for records that cannot be found.

The update operation uses `runValidators: true` to enforce schema validation during updates.

### 3.3 Furniture Routes

Created:

`backend/src/routes/furnitureRoutes.ts`

The following endpoints were configured:

| HTTP method | Endpoint | Function |
|---|---|---|
| POST | `/api/furniture` | Create furniture |
| GET | `/api/furniture` | Retrieve all furniture |
| GET | `/api/furniture/:id` | Retrieve one furniture item |
| PUT | `/api/furniture/:id` | Update furniture |
| DELETE | `/api/furniture/:id` | Delete furniture |

The Furniture router was registered in `app.ts` using:

`app.use("/api/furniture", furnitureRoutes);`

The final TypeScript check after this integration is pending.

---

## 4. Backend Architecture Learned

During this session, the difference between routes, controllers and models was discussed.

- **Models:** Define the structure of data and interact with MongoDB.
- **Controllers:** Handle incoming requests, execute application logic and return responses.
- **Routes:** Define API endpoints and direct incoming requests to the appropriate controller.

The request flow is:

Frontend → Routes → Controllers → Models → MongoDB

This separation helps keep the backend organised and easier to maintain.

## 5. Files Created or Updated

| File | Action |
|---|---|
| `src/models/Customer.ts` | Created |
| `src/controllers/customerController.ts` | Created |
| `src/routes/customerRoutes.ts` | Created |
| `src/models/Furniture.ts` | Created |
| `src/controllers/furnitureController.ts` | Created |
| `src/routes/furnitureRoutes.ts` | Created |
| `src/app.ts` | Updated with Customer and Furniture routers |

## 6. Testing and Verification

| Check | Result |
|---|---|
| Customer model TypeScript check | Passed |
| Customer route integration TypeScript check | Passed |
| Furniture model TypeScript check | Passed |
| Furniture controller and router final TypeScript check | Pending |
| Customer API endpoint testing | Further testing required |
| Furniture CRUD endpoint testing | Pending |

## 7. Outstanding Work

The following tasks remain:

- Complete the final TypeScript check after Furniture router integration.
- Test all Customer API operations.
- Test all five Furniture endpoints.
- Agree on a consistent measurement unit for furniture dimensions, such as centimetres or millimetres.
- Add further validation and improve error handling where necessary.
- Document the test cases and actual results.

## 8. Next Development Session

The next session is planned to cover:

1. Material Model and Controller.
2. Order Model and Controller.

After these modules, the remaining planned modules are Production, Payment, Delivery and User Management.

## 9. Session Conclusion

The session established the foundation for Customer and Furniture Management in the backend.

Both models and their controllers were created, and the Customer routes were integrated into the application. The Furniture routes have also been created and registered in the main application.

The next priority is to complete the final type check and progressively test the implemented endpoints before moving on to the next modules.
