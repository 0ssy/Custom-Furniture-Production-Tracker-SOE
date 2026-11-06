# Backend Development Log

## Development Session 2 — Express Server and Automated Testing

**Date:** 2 November 2026  
**Project:** Custom Furniture Production Tracker  
**Branch:** backend

### 1. Objectives

The objectives of this development session were:

- Configure the TypeScript compiler.
- Establish the backend folder structure.
- Create and configure the Express application.
- Start the backend development server.
- Verify that the server responds correctly.
- Introduce automated API testing.
- Identify and correct errors encountered during development.

---

### 2. TypeScript Configuration

Created and configured `tsconfig.json` with the following settings:

- `target: ES2022` — compiles TypeScript into modern JavaScript.
- `module: NodeNext` — follows Node.js module conventions.
- `moduleResolution: NodeNext` — resolves modules using Node.js conventions.
- `rootDir: ./src` — identifies the source code directory.
- `outDir: ./dist` — specifies where compiled JavaScript files will be placed.
- `strict: true` — enables strict type checking.
- `esModuleInterop: true` — supports interoperability with CommonJS modules.
- `skipLibCheck: true` — skips type checking of declaration files.
- `forceConsistentCasingInFileNames: true` — enforces consistent file-name casing.

### 3. Backend Folder Structure

Created the following directories:

```text
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.ts
│   └── server.ts
│
├── tests/
│   └── app.test.ts
│
├── package.json
├── package-lock.json
└── tsconfig.json
```

**Purpose of the directories:**

| Directory | Responsibility |
|---|---|
| config | Application and database configuration |
| controllers | Handle incoming HTTP requests |
| middleware | Request processing, authentication and authorization |
| models | Define MongoDB data models |
| routes | Define API endpoints |
| services | Contain application business logic |
| tests | Store automated tests |

### 4. Express Application Implementation

Created `src/app.ts`.

Implemented:

- Express application initialization.
- CORS middleware.
- JSON request-body parsing.
- A welcome endpoint using HTTP GET.

The initial endpoint is:

`GET /`

It returns:

```json
{
  "message": "Welcome to the Custom Furniture Production Tracker API",
  "status": "Server is running"
}
```

**Technical explanation:**

- Express initializes the web application.
- CORS allows communication between the frontend and backend when configured for the appropriate origins.
- `express.json()` allows the server to process incoming JSON request bodies.
- The GET endpoint responds to requests made to the backend root URL.

### 5. Server Implementation

Created `src/server.ts`.

Implemented:

- Environment variable loading using dotenv.
- Importing the Express application.
- Setting the server port to 5000 by default.
- Starting the application using `app.listen()`.

The server was successfully started using:

```powershell
npm run dev
```

The terminal displayed:

```text
Server running on http://localhost:5000
```

### 6. Manual API Testing

Opened the following URL in the browser:

`http://localhost:5000`

**Observed result:**

The browser returned the expected JSON welcome message.

**Result:** PASSED

This confirmed that the Express server was running and the root endpoint was responding.

### 7. TypeScript Verification

Executed:

```powershell
npm run typecheck
```

The command completed without errors.

**Result:** PASSED

This confirmed that TypeScript could check the current application without reporting type errors.

---

### 8. Introduction to Automated Testing

Installed the following development dependencies:

- Vitest — automated testing framework.
- Supertest — HTTP testing library.
- `@types/supertest` — TypeScript type definitions for Supertest.

Created the test file:

`tests/app.test.ts`

Implemented the first automated API test.

**Test description:** API Home Route

**Test case:** Should return a welcome message.

The test performs the following checks:

1. Sends an HTTP GET request to `/`.
2. Verifies that the response status is `200`.
3. Compares the returned JSON response with the expected message and status.

Added the following npm scripts:

```json
{
  "test": "vitest run",
  "test:watch": "vitest"
}
```

The automated test is executed using:

```powershell
npm test
```

---

### 9. Errors Encountered and Resolutions

#### Error 1: Incorrect spelling in the server import statement

**Problem:**

The server failed to start because the import statement contained `form` instead of `from`.

The error reported:

```text
ERROR: Expected "from" but found "form"
```

**Cause:**

A spelling mistake was made in `src/server.ts`.

**Resolution:**

Corrected the import statement to:

```typescript
import app from "./app.js";
```

**Lesson learned:**

TypeScript and its transformation tools detect syntax errors before the application can run.

#### Error 2: Repeated folder creation

**Problem:**

PowerShell displayed messages indicating that the `src` directory and its subdirectories already existed.

**Cause:**

The directory creation commands were executed again after the directories had already been created.

**Resolution:**

No repair was necessary. The existing directories were retained.

**Lesson learned:**

Before creating directories, check whether they already exist. These messages did not indicate damage to the project.

#### Error 3: Automated test failed because of a spelling mismatch

**Problem:**

The first automated test failed even though the API returned HTTP status `200`.

The expected and actual messages did not match.

Expected:

```text
Welcome to the custome Furniture Production Tracker API
```

Actual:

```text
Welcome to the Custome Furniture Production Tracker API
```

**Cause:**

There was an inconsistency in the capitalization of the expected message. The word `Custome` was also misspelled in the application message.

**Resolution:**

Corrected the application message and test expectation to:

```text
Welcome to the Custom Furniture Production Tracker API
```

Executed the test again.

**Lesson learned:**

Automated tests compare actual results with expected results. Small differences in spelling and capitalization can cause an assertion to fail.

---

### 10. Final Automated Testing Results

After correcting the spelling mismatch, executed:

```powershell
npm test
```

**Actual result:**

```text
✓ tests/app.test.ts (1 test)

✓ API Home Route
  ✓ should return a welcome message

Test Files  1 passed (1)
Tests       1 passed (1)
```

**Final test status:** PASSED

Also executed:

```powershell
npm run typecheck
```

**Result:** PASSED

### 11. Development Summary

| Activity | Result |
|---|---|
| TypeScript configuration | Completed |
| Backend folder structure | Completed |
| Express application | Completed |
| Server configuration | Completed |
| Server startup | Successful |
| Manual API test | Passed |
| TypeScript verification | Passed |
| Vitest installation | Completed |
| Supertest installation | Completed |
| First automated API test | Passed |
| Error identification and correction | Completed |

### 12. Outstanding Tasks

The following tasks are planned for the next development session:

1. Configure the MongoDB database connection.
2. Create the database configuration file.
3. Implement the Customer Mongoose model.
4. Define customer data validation.
5. Create customer service logic.
6. Implement customer API controllers and routes.
7. Add automated tests for customer endpoints.
8. Document API endpoints and expected request/response formats.

### 13. Conclusion

During this development session, the backend was successfully configured using TypeScript and Express.js. The development server was started and verified through manual testing. Automated testing was introduced using Vitest and Supertest.

Several minor errors were encountered, including an incorrect import keyword, repeated directory creation and a mismatch between the expected and actual API response. These issues were identified and resolved.

The backend currently has one working API endpoint and one passing automated test. The next development phase will focus on database connectivity and customer management functionality.