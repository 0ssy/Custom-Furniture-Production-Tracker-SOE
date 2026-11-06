# System Testing Documentation
## Custom Furniture Production Tracker

## 1. Introduction

This document records the system testing performed on the Custom Furniture Production Tracker backend.

The purpose of testing was to verify that the backend API endpoints function correctly, that information is stored and retrieved from MongoDB, and that authentication, authorization and business rules are enforced.

Testing was carried out manually using Postman and through automated testing using Vitest.

## 2. Testing Environment

| Component | Description |
|---|---|
| Backend runtime | Node.js |
| Backend framework | Express.js |
| Programming language | TypeScript |
| Database | MongoDB |
| Database library | Mongoose |
| API testing tool | Postman |
| Automated testing tool | Vitest |
| Authentication | JSON Web Token (JWT) |
| Password security | bcryptjs |
| Development environment | Visual Studio Code |
| Operating system | Windows |

## 3. Testing Approach

The following testing approaches were used:

- **Manual API testing:** Postman was used to send HTTP requests and inspect API responses.
- **Functional testing:** The main operations of each backend module were checked.
- **Authentication testing:** User registration, login and access to protected endpoints were tested.
- **Authorization testing:** Staff and Admin permissions were checked.
- **Database testing:** The application was checked to ensure that records could be created, retrieved, updated and deleted.
- **Automated testing:** The existing API home-route test was executed using Vitest.
- **Type checking and build verification:** TypeScript type checking and the production build were executed to identify compilation errors.

## 4. Functional Test Cases

The following test cases document the manual API testing performed using Postman.

### 4.1 Customer Module

| Test Scenario | Test Case | Pre-condition | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
|---|---|---|---|---|---|---|---|
| Customer management | Create customer | Server running and authenticated user available | Send POST request to customer endpoint | Test Customer, customer@test.com, phone and address details | Customer should be created and saved in MongoDB | Customer created successfully | Pass |
| Customer management | Retrieve all customers | Customer records exist | Send GET request to retrieve customers | Existing customer records | Customer records should be returned | Records retrieved successfully | Pass |
| Customer management | Retrieve customer by ID | Valid customer ID exists | Send GET request using customer ID | Existing customer ID | Requested customer should be returned | Customer retrieved successfully | Pass |
| Customer management | Update customer | Existing customer record | Send PUT request with updated details | Updated customer details | Customer information should be updated | Update completed successfully | Pass |
| Customer management | Delete customer | Existing customer record and required permissions | Send DELETE request using customer ID | Existing customer ID | Customer should be deleted | Delete operation completed successfully | Pass |

### 4.2 Furniture Module

| Test Scenario | Test Case | Pre-condition | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
|---|---|---|---|---|---|---|---|
| Furniture management | Create furniture | Server running and authenticated user available | Send POST request to furniture endpoint | Test Chair, category Chair, base price 5000, dimensions 100 × 50 × 80 | Furniture should be created and saved | Furniture created successfully | Pass |
| Furniture management | Retrieve all furniture | Furniture records exist | Send GET request | Existing furniture records | Furniture records should be returned | Records retrieved successfully | Pass |
| Furniture management | Retrieve furniture by ID | Valid furniture ID exists | Send GET request using furniture ID | Existing furniture ID | Requested furniture should be returned | Furniture retrieved successfully | Pass |
| Furniture management | Update furniture | Existing furniture record | Send PUT request with updated details | Updated furniture details | Furniture information should be updated | Update completed successfully | Pass |
| Furniture management | Delete furniture | Existing furniture record and Admin access | Send DELETE request using furniture ID | Existing furniture ID | Furniture should be deleted | Admin deletion succeeded | Pass |

### 4.3 Material Module

| Test Scenario | Test Case | Pre-condition | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
|---|---|---|---|---|---|---|---|
| Material management | Create material | Server running and authenticated user available | Send POST request to material endpoint | Valid material details | Material should be created and saved | Material created successfully | Pass |
| Material management | Retrieve all materials | Material records exist | Send GET request | Existing material records | Material records should be returned | Records retrieved successfully | Pass |
| Material management | Retrieve material by ID | Valid material ID exists | Send GET request using material ID | Existing material ID | Requested material should be returned | Material retrieved successfully | Pass |
| Material management | Update material | Existing material record | Send PUT request with updated details | Updated material details | Material information should be updated | Update completed successfully | Pass |
| Material management | Delete material | Existing material record and required permissions | Send DELETE request using material ID | Existing material ID | Material should be deleted | Delete operation completed successfully | Pass |

### 4.4 Orders Module

| Test Scenario | Test Case | Pre-condition | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
|---|---|---|---|---|---|---|---|
| Order management | Create order | Customer and furniture records exist; authenticated user available | Send POST request to orders endpoint | Customer ID, furniture ID, quantity and unit price | Order should be created with the correct calculated amount | Order created successfully | Pass |
| Order management | Retrieve all orders | Order records exist | Send GET request | Existing order records | Orders should be returned | Orders retrieved successfully, including populated customer and furniture details | Pass |
| Order management | Retrieve order by ID | Valid order ID exists | Send GET request using order ID | Existing order ID | Requested order should be returned | Order retrieved successfully | Pass |
| Order management | Update order | Existing order record | Send PUT request with updated information | Updated order details | Order information should be updated | Update completed successfully | Pass |
| Order management | Restrict staff deletion | Staff user authenticated; order exists | Send DELETE request using order ID | Staff authentication token and order ID | Staff should not be allowed to delete the order | API returned 403 Forbidden | Pass |

### 4.5 Payments Module

| Test Scenario | Test Case | Pre-condition | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
|---|---|---|---|---|---|---|---|
| Payment management | Create payment | Existing order and authenticated user | Send POST request to payments endpoint | Order ID, amount 5000, Mobile Money, TEST-MPESA-001 | Payment should be created and linked to the order | Payment created successfully with Pending status | Pass |
| Payment management | Retrieve all payments | Payment records exist | Send GET request | Existing payment records | Payment records should be returned | Payments retrieved successfully | Pass |
| Payment management | Retrieve payment by ID | Valid payment ID exists | Send GET request using payment ID | Existing payment ID | Requested payment should be returned | Payment retrieved successfully with populated order details | Pass |
| Payment management | Update payment status | Existing payment record | Send PUT request with updated payment status | Payment status changed to Completed | Payment status should be updated | Payment status updated successfully | Pass |
| Payment management | Restrict staff deletion | Staff user authenticated; payment exists | Send DELETE request using payment ID | Staff authentication token and payment ID | Staff should not be allowed to delete the payment | API returned 403 Forbidden | Pass |

### 4.6 Production Module

| Test Scenario | Test Case | Pre-condition | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
|---|---|---|---|---|---|---|---|
| Production management | Create production record | Existing order and authenticated user | Send POST request to production endpoint | Order ID and notes: Production API testing | Production record should be created and linked to the order | Production record created successfully with Not Started status | Pass |
| Production management | Retrieve all production records | Production records exist | Send GET request | Existing production records | Production records should be returned | Record retrieved successfully with populated order information | Pass |
| Production management | Retrieve production by ID | Valid production ID exists | Send GET request using production ID | Existing production ID | Requested production record should be returned | Production record retrieved successfully | Pass |
| Production management | Update production status | Existing production record | Send PUT request with updated status and notes | In Progress; Production has started | Production status and notes should be updated | Update completed successfully | Pass |
| Production management | Restrict staff deletion | Staff user authenticated; production record exists | Send DELETE request using production ID | Staff authentication token and production ID | Staff should not be allowed to delete the production record | API returned 403 Forbidden | Pass |

### 4.7 Delivery Module

| Test Scenario | Test Case | Pre-condition | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
|---|---|---|---|---|---|---|---|
| Delivery management | Create delivery | Existing order and authenticated user | Send POST request to delivery endpoint | Valid order reference, delivery address and delivery date | Delivery record should be created | Delivery operation completed successfully | Pass |
| Delivery management | Retrieve all deliveries | Delivery records exist | Send GET request | Existing delivery records | Delivery records should be returned | Deliveries retrieved successfully | Pass |
| Delivery management | Retrieve delivery by ID | Valid delivery ID exists | Send GET request using delivery ID | Existing delivery ID | Requested delivery should be returned | Delivery retrieved successfully | Pass |
| Delivery management | Update delivery | Existing delivery record | Send PUT request with updated information | Updated delivery details | Delivery information should be updated | Update completed successfully | Pass |
| Delivery management | Restrict staff deletion | Staff user authenticated; delivery exists | Send DELETE request using delivery ID | Staff authentication token and delivery ID | Staff should not be allowed to delete the delivery record | Permission restriction worked as expected | Pass |

## 5. Authentication and Authorization Test Cases

Authentication and authorization were tested to verify that users can register and log in, protected routes require valid authentication, and users have access only to operations permitted by their roles.

### 5.1 Authentication Tests

| Test Scenario | Test Case | Pre-condition | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
|---|---|---|---|---|---|---|---|
| User registration | Register a new user | Server running | Send POST request to registration endpoint | Test Staff, staff@test.com, Staff12345 | User should be registered successfully | Registration returned HTTP 201 and assigned Staff role | Pass |
| User login | Login with valid credentials | Registered user exists | Send POST request to login endpoint | Registered email and password | User should log in and receive an authentication token | Login successful and token returned | Pass |
| Protected routes | Access protected endpoint without token | Server running | Send request without Authorization header | No token | Access should be denied | API returned HTTP 401 Unauthorized | Pass |
| Protected routes | Access protected endpoint with valid token | User successfully logged in | Include valid token in Authorization header and send request | Valid JWT | Access should be granted | Protected endpoint accessed successfully | Pass |

### 5.2 Authorization Tests

| Test Scenario | Test Case | Pre-condition | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
|---|---|---|---|---|---|---|---|
| Role-based access | Staff creates a record | Staff user authenticated | Send POST request to a permitted endpoint | Staff token and valid record data | Staff should be allowed to perform permitted operations | Staff creation operation succeeded | Pass |
| Role-based access | Staff attempts restricted deletion | Staff user authenticated; target record exists | Send DELETE request | Staff token and record ID | Request should be rejected | API returned HTTP 403 Forbidden | Pass |
| Admin permissions | Promote user to Admin | Existing Staff user and database access | Update the user's role in MongoDB and log in again | staff@test.com; role Admin | User should receive Admin permissions after obtaining a fresh token | Role updated successfully and Admin deletion succeeded | Pass |
| Admin permissions | Admin deletes a record | Admin user authenticated; target record exists | Send DELETE request | Admin token and furniture ID | Admin should be allowed to delete the record | Furniture deletion succeeded | Pass |

## 6. Automated Testing

Automated testing was performed using Vitest.

| Test Scenario | Test Case | Pre-condition | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
|---|---|---|---|---|---|---|---|
| API home route | Verify welcome message | Backend test environment configured | Run `npm test` | GET request to API home route | API should return the expected welcome message | Test passed successfully | Pass |

### Automated Test Result

- Testing framework: Vitest
- Test file: `tests/app.test.ts`
- Test suite: API Home Route
- Test case: should return a welcome message
- Tests passed: 1
- Tests failed: 0

The automated test completed successfully.

## 7. Type Checking and Build Verification

Additional checks were performed to ensure that the backend code compiles correctly and that the production build can be generated.

| Test Scenario | Test Case | Test Steps | Expected Results | Actual Results | Pass/Fail |
|---|---|---|---|---|---|
| TypeScript verification | Check for TypeScript errors | Run `npm run typecheck` | No TypeScript errors should be reported | Command completed successfully with no errors | Pass |
| Production build | Compile backend application | Run `npm run build` | TypeScript should compile and generate the production build | Build completed successfully | Pass |

## 8. Testing Summary

The backend testing covered all seven functional modules:

1. Customer management
2. Furniture management
3. Material management
4. Order management
5. Payment management
6. Production management
7. Delivery management

Authentication and authorization were also tested to verify user registration, login, protected route access and role-based permissions.

The final verification included:

- Successful manual API testing using Postman.
- Successful authentication and authorization checks.
- Successful TypeScript type checking.
- Successful production build.
- Successful execution of the existing automated test.

## 9. Conclusion

The testing process confirmed that the Custom Furniture Production Tracker backend modules performed their tested operations successfully.

The API endpoints were tested using Postman, and the system was checked for correct data handling, authentication and role-based access control.

The automated home-route test passed, and both TypeScript type checking and production build verification completed successfully.

Based on the tests performed, the backend implementation is functioning as expected for the tested operations.

---

**Document:** System Testing Documentation
**Project:** Custom Furniture Production Tracker
**Component:** Backend
**Testing Tools:** Postman and Vitest