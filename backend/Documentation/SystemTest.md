# System Testing Process – Custom Furniture Production Tracker

## 1. System Testing Process

System testing was conducted to verify that the backend modules of the Custom Furniture Production Tracker function according to the project requirements.

Test cases were prepared to specify the inputs, expected results and actual results of each test. Postman was used to send HTTP requests to the backend API and verify the responses.

The testing covered the following modules:

- Customer Management
- Furniture Management
- Material Management
- Order Management
- Payment Management
- Production Management
- Delivery Management
- Authentication and Authorization

## 2. Test Cases

A test case is a set of actions performed to verify a particular feature or functionality of a software application. Each test case has an expected result and an actual result. The test is marked as either Pass or Fail.

The following table presents the manual API test cases performed on the backend.

| Test Scenario | Test Case | Precondition | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
|---|---|---|---|---|---|---|---|
| Customer creation | Verify that a customer can be registered. | Backend running; authenticated Staff user. | Send POST request to customer endpoint. | Valid customer details. | Customer record should be created successfully. | Customer was created successfully. | Pass |
| Customer retrieval | Verify that all customers can be retrieved. | Customer records exist; authenticated user. | Send GET request to customers endpoint. | No request body. | System should return the customer records. | Customer records returned successfully. | Pass |
| Customer update | Verify that customer details can be updated. | Existing customer record. | Send PUT request with updated details. | Valid updated customer information. | Customer information should be updated. | Customer was updated successfully. | Pass |
| Customer deletion | Verify that Staff cannot delete a customer. | Existing customer; Staff token. | Send DELETE request. | Customer ID and Staff token. | System should reject the request with 403 Forbidden. | Access denied as expected. | Pass |
| Furniture creation | Verify that furniture can be registered. | Backend running; authenticated user. | Send POST request to furniture endpoint. | Valid furniture details. | Furniture record should be created. | Furniture was created successfully. | Pass |
| Furniture retrieval | Verify that furniture records can be retrieved. | Furniture records exist. | Send GET request. | No request body. | System should return furniture records. | Furniture records returned successfully. | Pass |
| Furniture update | Verify that furniture details can be updated. | Existing furniture record. | Send PUT request. | Valid updated furniture details. | Furniture record should be updated. | Furniture was updated successfully. | Pass |
| Furniture deletion | Verify that Staff cannot delete furniture. | Existing furniture; Staff token. | Send DELETE request. | Furniture ID and Staff token. | System should return 403 Forbidden. | Access denied as expected. | Pass |
| Material creation | Verify that materials can be registered. | Backend running; authenticated user. | Send POST request to materials endpoint. | Valid material details. | Material record should be created. | Material was created successfully. | Pass |
| Material retrieval | Verify that materials can be retrieved. | Material records exist. | Send GET request. | No request body. | System should return material records. | Material records returned successfully. | Pass |
| Material update | Verify that material details can be updated. | Existing material record. | Send PUT request. | Valid updated material details. | Material record should be updated. | Material was updated successfully. | Pass |
| Material deletion | Verify that Staff cannot delete materials. | Existing material; Staff token. | Send DELETE request. | Material ID and Staff token. | System should return 403 Forbidden. | Access denied as expected. | Pass |
| Order creation | Verify that an order can be created and its total calculated. | Existing customer and furniture records. | Send POST request to orders endpoint. | Customer ID, furniture ID, quantity and unit price. | Order should be created with the correct calculated total. | Order created successfully with calculated total. | Pass |
| Order retrieval | Verify that all orders can be retrieved. | Existing order records. | Send GET request. | No request body. | System should return orders and populated references. | Orders returned successfully with populated references. | Pass |
| Order update | Verify that an existing order can be updated. | Existing order record. | Send PUT request. | Updated order details. | Order should be updated successfully. | Order update completed successfully. | Pass |
| Order deletion | Verify that Staff cannot delete an order. | Existing order; Staff token. | Send DELETE request. | Order ID and Staff token. | System should return 403 Forbidden. | Access denied as expected. | Pass |
| Payment creation | Verify that a payment can be recorded. | Existing order; authenticated user. | Send POST request to payments endpoint. | Order ID, amount, payment method and transaction reference. | Payment record should be created. | Payment created successfully with Pending status. | Pass |
| Payment retrieval | Verify that payments can be retrieved. | Existing payment records. | Send GET request. | No request body. | System should return payment records. | Payment records returned successfully. | Pass |
| Payment update | Verify that payment status can be updated. | Existing payment record. | Send PUT request. | Updated payment status. | Payment details should be updated. | Payment status changed successfully to Completed. | Pass |
| Payment deletion | Verify that Staff cannot delete a payment. | Existing payment; Staff token. | Send DELETE request. | Payment ID and Staff token. | System should return 403 Forbidden. | Access denied as expected. | Pass |
| Production creation | Verify that a production record can be created. | Existing order; authenticated user. | Send POST request to production endpoint. | Order ID and production notes. | Production record should be created with default status Not Started. | Production record created with Not Started status. | Pass |
| Production retrieval | Verify that production records can be retrieved. | Existing production record. | Send GET request. | No request body. | System should return production records and order details. | Production records returned successfully. | Pass |
| Production update | Verify that production status can be updated. | Existing production record. | Send PUT request. | Production status changed to In Progress. | Production record should be updated. | Update completed successfully. | Pass |
| Production deletion | Verify that Staff cannot delete a production record. | Existing production record; Staff token. | Send DELETE request. | Production ID and Staff token. | System should return 403 Forbidden. | Access denied as expected. | Pass |
| Delivery creation | Verify that a delivery record can be created. | Existing order; authenticated user. | Send POST request to deliveries endpoint. | Order ID, delivery address, delivery date and notes. | Delivery record should be created with default Pending status. | Delivery record created successfully. | Pass |
| Delivery retrieval | Verify that delivery records can be retrieved. | Existing delivery record. | Send GET request. | No request body. | System should return delivery records. | Delivery records returned successfully. | Pass |
| Delivery update | Verify that delivery details can be updated. | Existing delivery record. | Send PUT request. | Valid updated delivery details. | Delivery record should be updated. | Delivery was updated successfully. | Pass |
| Delivery deletion | Verify that Staff cannot delete a delivery. | Existing delivery record; Staff token. | Send DELETE request. | Delivery ID and Staff token. | System should return 403 Forbidden. | Access denied as expected. | Pass |
| User registration | Verify that a new user can register. | Backend running. | Send POST request to registration endpoint. | Full name, email and password. | User should be registered with Staff role by default. | User registered successfully. | Pass |
| User login | Verify that a registered user can log in. | Registered user account. | Send POST request to login endpoint. | Valid email and password. | System should return a JWT authentication token. | Login successful and token returned. | Pass |
| Protected route | Verify that unauthenticated users cannot access protected endpoints. | Backend running; no token supplied. | Send GET request without Authorization header. | No authentication token. | System should return 401 Unauthorized. | Access rejected as expected. | Pass |
| Role authorization | Verify that Staff users cannot perform Admin-only operations. | Valid Staff authentication token. | Attempt an Admin-only DELETE request. | Staff token and existing record ID. | System should return 403 Forbidden. | Access denied as expected. | Pass |
| Admin authorization | Verify that Admin users can perform Admin-only operations. | Valid Admin authentication token. | Perform an Admin-only DELETE request. | Admin token and existing record ID. | System should permit the operation. | Admin deletion succeeded during authorization testing. | Pass |

## 3. Why Test the Software?

Software testing was conducted to demonstrate that the backend meets its functional requirements and that its features behave as expected.

Testing also helped identify errors, verify data handling, check authentication and authorization, and confirm that users with different roles have the appropriate permissions.

## 4. System Testing Summary

The backend API modules were manually tested using Postman. The tests covered record creation, retrieval, updating, deletion permissions, authentication and authorization.

All reported manual API tests passed.

The project also contains one automated test for the API home route. It was executed using Vitest and passed successfully.

Final verification results:

- TypeScript typecheck: Passed.
- Production build: Passed.
- Automated test: 1 passed.
- Manual API testing: Passed.
- Authentication and authorization testing: Passed.

**Conclusion:** The backend testing process confirmed that the implemented API functionality operates successfully under the tested conditions.