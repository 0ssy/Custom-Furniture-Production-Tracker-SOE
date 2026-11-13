## DevLog 8 – Complete API and Five-Role Authorization Testing

### Objective
Complete Postman testing of all backend API endpoints and verify role-based access control (RBAC) across the five user roles.

### User Roles
- **Administrator:** Full administrative access, including user management and record deletion.
- **Manager:** Business management access, excluding user management and record deletion.
- **Sales:** Customer, order and payment operations according to assigned permissions.
- **Production:** Materials and production operations according to assigned permissions.
- **Delivery:** Delivery operations according to assigned permissions.

### Testing Performed

All backend API endpoints were tested using Postman, covering:

1. Authentication – registration, login and authentication protection.
2. User management – listing users and managing user accounts.
3. Customer management – creating, retrieving, updating and deleting customers.
4. Furniture management – creating, retrieving, updating and deleting furniture.
5. Material management – creating, retrieving, updating and deleting materials.
6. Order management – creating, retrieving, updating and deleting orders.
7. Payment management – creating, retrieving, updating and deleting payments.
8. Production management – creating, retrieving, updating and deleting production records.
9. Delivery management – creating, retrieving, updating and deleting delivery records.

### Role-Based Permission Verification

All five roles were tested against their assigned permissions.

- Administrator successfully accessed administrative functions and performed authorized deletion.
- Manager successfully performed permitted business operations but was denied access to user management and deletion.
- Sales successfully performed permitted customer operations but was denied unauthorized material creation and customer deletion.
- Production successfully created and updated materials but was denied material deletion.
- Delivery successfully created and updated delivery records but was denied delivery deletion.

### Validation and Error Handling
- Verified successful responses for valid requests.
- Verified that unauthorized requests return `403 Forbidden`.
- Tested request validation using the required fields and data types.
- Confirmed that invalid request data is rejected with appropriate error responses.
- Verified that resource lookups and updates use valid MongoDB identifiers.

### Outcome
All backend API endpoints were tested successfully using Postman. Authentication, CRUD operations, request validation, error handling and role-based permissions were verified.

### Conclusion
Backend API testing and five-role authorization testing are complete. The backend is ready for final handoff and frontend integration.

**Status: All backend endpoints tested.**