# DevLog 7 – Authentication, Authorization and Backend Verification

**Date:** 5 November 2026
**Project:** Custom Furniture Production Tracker
**Area:** Backend Development

## 1. Authentication Implementation

Implemented user authentication using:

- **bcryptjs** – hashes passwords before storing them.
- **jsonwebtoken (JWT)** – generates authentication tokens after successful login.
- **Express middleware** – protects routes and verifies tokens.

### Features completed

- User registration.
- User login.
- Password hashing.
- JWT generation with a one-day expiry.
- Token verification.
- Protected API routes.
- Appropriate authentication error responses.

Registration automatically assigns the `Staff` role. Users cannot choose their own role during registration.

## 2. Role-Based Authorization

Implemented two user roles:

| Role | Permissions |
|---|---|
| Admin | Can perform all operations, including deletion. |
| Staff | Can create, view and update records but cannot delete them. |

The `protect` middleware verifies authentication, while the `authorize` middleware checks user permissions.

Deletion routes for Furniture, Materials, Orders, Payments, Production and Deliveries were restricted to Admin users.

## 3. Postman Testing

Manual API testing was performed using Postman.

| Test case | Expected result | Actual result |
|---|---|---|
| Register a new Staff user | 201 Created | Passed |
| Login with correct credentials | 200 OK and JWT token | Passed |
| Access protected route without token | 401 Unauthorized | Passed |
| Access furniture route with valid Staff token | 200 OK | Passed |
| Create furniture using Staff token | Furniture created | Passed |
| Delete furniture using Staff token | 403 Forbidden | Passed |
| Promote test user to Admin in MongoDB | Role updated | Passed |
| Delete furniture using fresh Admin token | Successful deletion | Passed |

### Test details

A test Staff account was registered:

- Email: `staff@test.com`
- Role: `Staff`

A furniture record named **Test Chair** was created for permission testing.

Its ID was:

`6aecc852d15c4ab1d26ded1d`

The Staff account received a `403 Forbidden` response when attempting to delete it. This confirmed that Staff deletion restrictions were working.

The test account was then temporarily promoted to Admin directly in MongoDB. After logging in again to obtain a fresh JWT token, the same deletion request succeeded with the response:

```json
{
  "message": "Furniture deleted successfully"
}
```

This confirmed that Admin deletion permissions were working.

## 4. Final Backend Verification

The following commands were executed from the backend directory:

| Command | Result |
|---|---|
| `npm run typecheck` | Passed |
| `npm test` | Passed – 1 test |
| `npm run build` | Passed |

The existing automated test checks the API home route and confirms that it returns the expected welcome message.

No additional automated tests were added, in accordance with the lecturer's requirements. Authentication and authorization were verified manually using Postman.

## 5. Issues and Lessons Learned

- A MongoDB role change does not update an already-issued JWT. The user must log in again to receive a token containing the updated role.
- Protected routes must use the authentication middleware before authorization checks.
- Authentication and authorization serve different purposes: authentication confirms who the user is, while authorization determines what the user can do.
- Testing with both Staff and Admin accounts helped verify the permission restrictions.

## 6. Current Status

**Completed:**
- User registration and login.
- Password hashing.
- JWT authentication.
- Protected backend routes.
- Admin and Staff authorization.
- Manual authentication and permission testing.
- TypeScript type checking, existing automated test and production build.

**Next steps:**
- Continue manual API testing for the remaining backend modules.
- Check validation and error handling.
- Verify MongoDB operations across all modules.
- Prepare API documentation for frontend integration.

**Overall result:** Authentication and role-based authorization are implemented and successfully verified. The backend passes its current typecheck, test and build checks.

## Correction
## 1. Authentication Implementation

Implemented user authentication using the following packages:

| Package | Purpose |
|---|---|
| `bcryptjs` | Hashes passwords securely before storing them. |
| `jsonwebtoken` | Generates and verifies JSON Web Tokens (JWT). |
| `@types/bcryptjs` | Provides TypeScript type definitions for bcryptjs. |
| `@types/jsonwebtoken` | Provides TypeScript type definitions for jsonwebtoken. |

### Features completed

- User registration.
- User login.
- Password hashing using bcryptjs with a salt factor of 10.
- JWT generation with a one-day expiry.
- Token verification through authentication middleware.
- Protected API routes.
- Authentication error handling.

Registration automatically assigns the `Staff` role. Users cannot choose their own role during registration.