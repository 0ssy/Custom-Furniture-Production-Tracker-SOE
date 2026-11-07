# Frontend Feature 09: Login, Register and Protected Pages

## What it does
Lets a user register and log in using the backend. After login the token is
saved in the browser and sent with every request. Pages other than /login
cannot be opened without a login. The sidebar shows the user's name and role
and a Log out button.

## Files
- `src/services/api.ts`: talks to the backend, adds the token, handles errors
- `src/context/AuthContext.tsx`: keeps the logged-in user and the login/logout functions
- `src/components/ProtectedRoute.tsx`: sends visitors to /login when not logged in
- `src/pages/Login.tsx`: login and register form
- `src/components/Layout.tsx`: sidebar now shows the user and Log out
- `src/App.tsx`, `src/main.tsx`: routes and AuthProvider

## Backend endpoints used
| Endpoint | Sends | Gets back |
| --- | --- | --- |
| `POST /api/auth/register` | `fullName`, `email`, `password` | the new user (always role Staff) |
| `POST /api/auth/login` | `email`, `password` | `token` and `user` (`id`, `fullName`, `email`, `role`) |

## How it works
After login the token and user are saved in `localStorage`, so a refresh does
not log the user out. `apiFetch` adds `Authorization: Bearer <token>` to every
request. If the backend answers 401 on a normal page (token missing or expired,
the token lasts 1 day) the user is logged out and sent to /login. Wrong
passwords also give 401 but are shown as an error message instead.

## Validation rules
- Full name (register only): at least 2 characters
- Email: valid format
- Password: at least 6 characters

## How it was tested
Tested manually in the browser at `localhost:5173` with the backend running
on port 5000.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check page protection | TC01: Open a page while logged out | Backend and frontend running, no saved login | 1. Open `localhost:5173/customers` | None | The login page opens instead | Redirected to /login | Pass |
| Check login validation | TC02: Submit an empty form | Login page is open | 1. Click Log In with empty inputs | Empty inputs | "Please enter a valid email" shows | Error was shown, no request was sent | Pass |
| Check login validation | TC03: Enter a short password | Login page is open | 1. Type email and password<br>2. Click Log In | Email: `staff@test.com`<br>Password: `123` | "Password must be at least 6 characters" shows | Error was shown | Pass |
| Check login | TC04: Log in with a wrong password | A registered user exists | 1. Type the email and a wrong password<br>2. Click Log In | Email: `staff@test.com`<br>Password: `Wrong12345` | "Invalid email or password" shows | The backend message was shown | Pass |
| Check register | TC05: Register a new staff user | Login page is open | 1. Click "No account? Register"<br>2. Fill the form<br>3. Click Register | Name: `Test Staff`<br>Email: `staff@test.com`<br>Password: `Staff12345` | Account is created, user is logged in and the dashboard opens | Dashboard opened | Pass |
| Check login | TC06: Log in with valid details | Registered user exists, logged out | 1. Type email and password<br>2. Click Log In | Email: `staff@test.com`<br>Password: `Staff12345` | Dashboard opens, sidebar shows "Test Staff" and "Staff" | Name and role were shown | Pass |
| Check duplicate register | TC07: Register with an email already used | Login page is open in register mode | 1. Fill the form with the same email<br>2. Click Register | Email: `staff@test.com` | "Email already registered" shows | The backend message was shown | Pass |
| Check session | TC08: Refresh the page while logged in | User is logged in | 1. Press F5 | None | User stays logged in | Still logged in | Pass |
| Check logout | TC09: Log out | User is logged in | 1. Click Log out in the sidebar<br>2. Open `localhost:5173/customers` | None | Login page opens both times | Login page was shown | Pass |
| Check server error | TC10: Backend is not running | Backend stopped | 1. Try to log in | Any valid details | "Cannot reach the server. Is the backend running on port 5000?" shows | The message was shown | Pass |

## Known issues / to do
- The token is kept in `localStorage`. This is simple and fine for a school
  project, but a real system would use more secure storage.
- Registration always creates a Staff user. Admin is set by hand in MongoDB.
- The menu does not yet change between Admin and Staff.
- The requirements list 5 roles but the backend has only Admin and Staff.
- The API address (`http://localhost:5000/api`) is written in `api.ts`. It
  must change when the system is deployed.
- There is no "forgot password" because the backend has no such endpoint.
- Anyone who can open the login page can register and get a Staff account,
  because the backend register route is public. A real system would use
  invitations or admin approval. Raised with Jose.
- If the user logs out or switches account in one browser tab, other open tabs
  do not update until they are refreshed.