# DEVLOG 4 – MongoDB Integration and Backend Database Connection

**Project:** Custom Furniture Production Tracker  
**Module:** Backend Development  
**Technology Stack:** Node.js, TypeScript, Express.js, MongoDB, Mongoose  
**Environment:** Windows, PowerShell, Visual Studio Code  
**Date:** 3 November 2026

---

## 1. Introduction

This development session focused on integrating MongoDB with the existing Express.js backend of the Custom Furniture Production Tracker.

Previously, the backend had been configured with Node.js, TypeScript and Express.js. The API was already capable of running and returning a welcome message, and the first automated API test had passed.

The objective of this session was to move beyond a standalone Express server and establish a working connection between the backend application and the MongoDB database.

The work involved:

1. Troubleshooting MongoDB Shell access from PowerShell.
2. Configuring the Windows PATH environment variable.
3. Verifying communication with the local MongoDB Server.
4. Inspecting the existing environment configuration.
5. Creating a Mongoose database connection module.
6. Integrating the database connection into the Express server.
7. Performing TypeScript and runtime verification.

---

## 2. Initial Problem: MongoDB Shell Not Recognised

When attempting to use MongoDB Shell, PowerShell returned an error:

```text
mongosh: The term 'mongosh' is not recognized as a name of a cmdlet,
function, script file, or executable program.
```

### Investigation

The MongoDB Shell had previously been installed successfully, but Windows could not locate its executable through the PATH environment variable.

To investigate, the following command was executed:

```powershell
Get-ChildItem "$env:LOCALAPPDATA\Programs\mongosh" -Recurse -Filter mongosh.exe | Select-Object -ExpandProperty FullName
```

The command returned:

```text
C:\Users\josep\AppData\Local\Programs\mongosh\mongosh.exe
```

This confirmed that MongoDB Shell was installed correctly.

### Temporary workaround

MongoDB Shell was launched directly using its full executable path:

```powershell
& "$env:LOCALAPPDATA\Programs\mongosh\mongosh.exe"
```

The shell successfully opened and connected to the local MongoDB Server.

---

## 3. Verifying MongoDB Server Connectivity

After opening MongoDB Shell, the following command was executed:

```javascript
db.runCommand({ ping: 1 })
```

The server returned:

```javascript
{ ok: 1 }
```

### Interpretation

The `ping` command is a basic MongoDB connectivity check.

The response `{ ok: 1 }` confirmed that MongoDB Shell could communicate with the MongoDB Server running locally.

This established that the database service was accessible before attempting to connect the backend application.

---

## 4. Configuring MongoDB Shell in Windows PATH

Although MongoDB Shell worked through its full executable path, using that path repeatedly was inconvenient.

The next objective was to make the `mongosh` command available directly in PowerShell.

### Step 1: Identify the installation directory

```powershell
$mongoshDir = "$env:LOCALAPPDATA\Programs\mongosh"
```

### Step 2: Retrieve the existing user PATH

```powershell
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
```

### Step 3: Add MongoDB Shell to PATH

```powershell
if (($userPath -split ";") -notcontains $mongoshDir) {
    $newPath = if ([string]::IsNullOrWhiteSpace($userPath)) {
        $mongoshDir
    } else {
        "$userPath;$mongoshDir"
    }

    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
}

Write-Host "MongoDB Shell added to your user PATH."
```

PowerShell displayed:

```text
MongoDB Shell added to your user PATH.
```

### Problem encountered

Immediately attempting to run:

```powershell
mongosh --version
```

still produced an error stating that `mongosh` was not recognised.

### Cause

Updating the permanent Windows PATH does not automatically refresh environment variables inside an already-running PowerShell session.

### Resolution

The current session was refreshed using:

```powershell
$env:Path += ";$env:LOCALAPPDATA\Programs\mongosh"
```

The command was tested again:

```powershell
mongosh --version
```

Result:

```text
2.14.1
```

The executable location was also verified using:

```powershell
Get-Command mongosh
```

PowerShell successfully identified:

```text
Application     mongosh.exe     2.14.1.0
```

**Outcome:** MongoDB Shell became accessible through the shorter `mongosh` command in the refreshed terminal.

The permanent PATH update was also saved for future terminal sessions. A fresh terminal should be used to verify that it loads automatically.

---

## 5. Understanding the MongoDB Connection String

During the configuration process, the MongoDB connection string was initially entered directly into PowerShell:

```text
mongodb://127.0.0.1:27017/furniture_production_tracker
```

PowerShell returned an error because it attempted to interpret the connection string as a command.

### Lesson learned

A MongoDB connection string is not a PowerShell command.

It is a configuration value that tells the backend application where the MongoDB Server is located and which database to use.

The connection string consists of:

| Component | Meaning |
|---|---|
| `mongodb://` | MongoDB connection protocol |
| `127.0.0.1` | Local computer |
| `27017` | Default MongoDB port |
| `furniture_production_tracker` | Database name |

The connection string would therefore be stored in an environment variable and accessed by the backend through Node.js.

---

## 6. Inspecting Existing Environment Configuration

Initially, another `.env` file was going to be created inside the backend folder.

However, inspection of the project structure revealed that a root-level `.env` and `.gitignore` already existed.

The project structure included:

```text
Custom-Furniture-Production-Tracker-SOE/
│
├── .env
├── .gitignore
│
├── backend/
│   ├── src/
│   ├── tests/
│   ├── DevLog.md
│   ├── Devlog2.md
│   ├── DevLog3.md
│   ├── DevLog4.md
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
```

The existing root environment configuration was inspected using:

```powershell
cd ..
Get-Content .env
Get-Content .gitignore
```

### Existing `.env` configuration

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/furniture_production_tracker
```

Two environment variables were configured:

- `PORT`: Defines the port used by the Express server.
- `MONGO_URI`: Defines the MongoDB connection address.

### Existing `.gitignore` configuration

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
coverage/
```

### Importance of `.gitignore`

The existing configuration was already suitable for protecting environment files.

- `.env` prevents the main environment file from being committed.
- `.env.*` ignores other environment-specific files.
- `!.env.example` allows a safe example configuration to be committed.
- `node_modules/` prevents installed dependencies from being uploaded.
- `dist/` excludes compiled output.
- `coverage/` excludes test coverage output.

**Decision:** The existing root `.env` and `.gitignore` were retained rather than creating unnecessary duplicate files.

---

## 7. Creating the Mongoose Database Connection Module

The next step was to introduce Mongoose into the backend.

Mongoose is an Object Data Modeling (ODM) library that allows Node.js applications to interact with MongoDB using schemas and models.

It provides a structured way to define how application data should be stored.

### File created

```text
backend/src/config/db.ts
```

### Implementation

```typescript
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI is missing from the environment variables");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
```

### Explanation of the implementation

**1. Importing Mongoose**

```typescript
import mongoose from "mongoose";
```

Imports the Mongoose library, which provides the functionality required to communicate with MongoDB.

**2. Creating the connection function**

```typescript
const connectDB = async (): Promise<void> => {
```

Defines an asynchronous function responsible for establishing the database connection.

The `Promise<void>` return type indicates that the function completes asynchronously without returning a specific data value.

**3. Retrieving the connection string**

```typescript
const mongoURI = process.env.MONGO_URI;
```

Retrieves the MongoDB connection string from the environment variables.

**4. Checking the environment variable**

```typescript
if (!mongoURI) {
  throw new Error("MONGO_URI is missing from the environment variables");
}
```

Prevents the application from attempting a database connection when the required configuration is missing.

**5. Connecting to MongoDB**

```typescript
await mongoose.connect(mongoURI);
```

Uses Mongoose to establish the connection.

The `await` keyword ensures the application waits for the connection attempt to finish before continuing.

**6. Error handling**

```typescript
catch (error) {
  console.error("MongoDB connection failed:", error);
  process.exit(1);
}
```

Catches connection errors and stops the application if the database cannot be reached.

**7. Exporting the function**

```typescript
export default connectDB;
```

Makes the connection function available to other backend files.

---

## 8. Integrating MongoDB with the Express Server

After creating the database connection module, the next step was integrating it into the existing Express server.

### File modified

```text
backend/src/server.ts
```

### Previous implementation

The original server started Express directly:

```typescript
import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

This implementation did not explicitly establish a database connection before starting the server.

### Updated implementation

```typescript
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

// Load the environment variables from the project root
dotenv.config({ path: "../.env" });

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start Express only after MongoDB connects
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
```

### Explanation of the changes

**1. Importing dotenv**

```typescript
import dotenv from "dotenv";
```

Imports dotenv so that the application can load the environment variables stored in the root `.env` file.

**2. Importing the database connection function**

```typescript
import connectDB from "./config/db.js";
```

Makes the previously created database connection function available to the server.

**3. Loading the root environment file**

```typescript
dotenv.config({ path: "../.env" });
```

Specifies the location of the existing root `.env` file.

This is necessary because the backend is normally started from the `backend` directory.

**4. Creating the startup function**

```typescript
const startServer = async (): Promise<void> => {
```

Organises the startup process inside an asynchronous function.

**5. Connecting to MongoDB before starting Express**

```typescript
await connectDB();
```

Ensures that the database connection succeeds before Express starts accepting incoming requests.

**6. Starting the Express server**

```typescript
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

Starts the application after the database connection has completed successfully.

**7. Starting the application**

```typescript
startServer();
```

Executes the startup function.

### Architectural decision

The database connection was kept separate from `app.ts`.

This separation is useful because:

- `app.ts` configures Express, middleware and routes.
- `db.ts` handles MongoDB connectivity.
- `server.ts` coordinates application startup.

It also keeps the Express application easier to test independently without automatically connecting to the database during API tests.

---

## 9. TypeScript Verification

After updating `server.ts`, the TypeScript compiler was used to check the implementation.

Command executed from the backend directory:

```powershell
npm run typecheck
```

Terminal output:

```text
> furniture-production-tracker-backend@1.0.0 typecheck
> tsc --noEmit
```

No errors were reported.

**Result: PASSED**

This confirmed that the updated TypeScript code passed the project's configured type checking.

---

## 10. Starting the Backend Application

The backend was started using:

```powershell
npm run dev
```

This command executes the configured development script:

```json
"dev": "tsx watch src/server.ts"
```

The terminal returned:

```text
> furniture-production-tracker-backend@1.0.0 dev
> tsx watch src/server.ts

◇ injected env (2) from ..\.env
Connection Successfull
Server running on http://localhost:5000
```

### Interpretation of the output

**Environment variables loaded**

```text
◇ injected env (2) from ..\.env
```

Confirmed that the application loaded two environment variables from the root `.env` file.

**Database connection successful**

```text
Connection Successfull
```

Confirmed that the application's database connection function completed successfully.

**Express server started**

```text
Server running on http://localhost:5000
```

Confirmed that Express started listening on port 5000.

The order of these messages demonstrated that the application connected to MongoDB before starting the Express server.

---

## 11. API Browser Verification

After the backend started, the API was opened in a web browser:

```text
http://localhost:5000
```

The browser returned:

```json
{
  "message": "Welcome to the Custom Furniture Production Tracker API",
  "status": "Server is running"
}
```

This matched the expected response configured in `backend/src/app.ts`.

**Result: PASSED**

The browser test confirmed that the Express API remained accessible after introducing the MongoDB connection requirement.

---

## 12. Problems Encountered and Solutions

| Problem | Cause | Resolution |
|---|---|---|
| PowerShell could not recognise `mongosh`. | MongoDB Shell directory was not available through PATH. | Located the executable and added its directory to the user PATH. |
| `mongosh` remained unrecognised after PATH modification. | Existing PowerShell session had not refreshed its environment. | Updated the current session PATH. |
| MongoDB URI entered directly into PowerShell. | Connection strings are configuration values, not executable commands. | Stored the URI in the root `.env` file. |
| Initially attempted to create another `.env` file. | Existing root configuration had not yet been inspected. | Reused the existing root `.env` and `.gitignore`. |
| Need to load root environment variables from the backend. | The backend runs from a subdirectory. | Configured dotenv with `path: "../.env"`. |

### Important lessons learned

1. Installing software does not always make its command available in the terminal automatically.
2. Windows environment variable changes may require a terminal restart or session refresh.
3. MongoDB connection strings belong in configuration files or environment variables.
4. Environment files should not be committed to GitHub.
5. Database connection logic should be separated from Express application configuration.
6. An asynchronous database connection should complete before the server starts accepting requests.
7. TypeScript type checking and runtime testing serve different purposes.

---

## 13. Current Backend Project Structure

Following this development session, the relevant backend structure is:

```text
backend/
│
├── .adsum/
│
├── src/
│   ├── config/
│   │   └── db.ts
│   │
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   │
│   ├── app.ts
│   └── server.ts
│
├── tests/
│   └── app.test.ts
│
├── DevLog.md
├── Devlog2.md
├── DevLog3.md
├── DevLog4.md
├── README.md
├── package.json
├── package-lock.json
└── tsconfig.json
```

The root project also contains the shared `.env` and `.gitignore` files.

---

## 14. Testing and Verification Summary

| Test | Expected result | Actual result | Status |
|---|---|---|---|
| Locate MongoDB Shell | Find `mongosh.exe` | Executable found | PASSED |
| MongoDB ping | `{ ok: 1 }` | `{ ok: 1 }` | PASSED |
| MongoDB Shell version | Display installed version | `2.14.1` | PASSED |
| PowerShell command lookup | Locate `mongosh.exe` | Executable located | PASSED |
| Environment configuration | Load two variables | Two variables injected | PASSED |
| TypeScript check | No compiler errors | No errors reported | PASSED |
| Mongoose connection | Connect to local MongoDB | `Connection Successfull` | PASSED |
| Express startup | Listen on port 5000 | Server started | PASSED |
| Browser API test | Return welcome JSON | Expected JSON returned | PASSED |

**Testing note:** These results verify the database connection and the existing API endpoint. They do not yet verify CRUD operations, database model validation, or persistence of customer and order records.

---

## 15. Current Development Status

### Completed

- MongoDB Server installation and Windows service configuration.
- MongoDB Shell installation and connectivity verification.
- Windows PATH configuration for MongoDB Shell.
- Root environment configuration inspection.
- Existing `.gitignore` verification.
- Creation of the Mongoose database connection module.
- Integration of the database connection into the Express startup process.
- TypeScript type checking.
- Successful MongoDB connection through the backend.
- Successful Express server startup.
- Successful browser verification of the API home route.

### Remaining work

1. Create the first Mongoose model, starting with Customer.
2. Define customer data fields and validation rules.
3. Implement customer CRUD operations.
4. Create controllers and routes.
5. Test database record creation, retrieval, updating and deletion.
6. Add appropriate automated tests.
7. Continue implementing the furniture orders, materials, production, payments and delivery modules.
8. Maintain API documentation and coordinate endpoint requirements with the frontend developer.

---

## 16. Conclusion

This development session successfully established the initial database integration for the Custom Furniture Production Tracker.

The project progressed from an Express-only backend to an application that establishes a MongoDB connection before starting the API server.

The implementation introduced Mongoose, environment-based database configuration, asynchronous application startup and basic connection error handling.

Both TypeScript verification and runtime testing completed successfully. The existing API home route also remained accessible after the integration.

The next development phase will focus on creating database models and implementing the actual business functionality of the Furniture Production Tracker.

**Milestone achieved: Initial MongoDB integration successfully completed.**

---

**End of DevLog 4.**