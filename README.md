# TODO App - Task Manager

A feature-rich task management application with a Kanban-style board, user authentication, and real-time synchronization. Move tasks between "To Do", "In Progress", and "Done" columns.

## Tech Stack

- **Frontend:** HTML, Vanilla JavaScript, Tailwind CSS (via CDN)
- **Authentication:** Firebase Authentication (Email/Password)
- **Database:** Firebase Firestore (NoSQL Cloud Database)
- **Hosting:** Firebase Hosting / GitHub Pages

## Features

### Authentication & Security
- 🔐 User registration and login with Email/Password
- 🔒 Secure authentication via Firebase
- 👤 User-specific task isolation (users only see their own tasks)

### Task Management
- ✅ Add new tasks with title, description, priority, and due date
- ✅ Three-column Kanban board (To Do, In Progress, Done)
- ✅ Drag-and-drop to move tasks between columns
- ✅ Edit and delete tasks
- ✅ Real-time task synchronization across devices
- ✅ Task filtering (by priority, status, due date)
- ✅ Search functionality
- ✅ Task statistics dashboard

### Advanced Features
- 🎨 Multiple themes (Light, Dark, Minimal)
- 🏆 Achievement/Badge system
- 🔥 Daily streak tracking
- 🎉 Confetti animation on task completion
- 🔔 Browser notifications for due tasks
- 📱 Fully responsive design (mobile-friendly)
- ⚡ Real-time updates with Firestore

## Project Structure

```
todo-app/
├── index.html              # Main application (standalone version)
├── firebase.json           # Firebase hosting configuration
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore database indexes
├── standalone.html         # Backup copy
├── backend/                # Legacy backend (not used)
├── frontend/               # Alternative simple version
└── README.md
```

## Setup and Installation

### Prerequisites

- A Firebase account (free tier is sufficient)
- Firebase CLI installed globally: `npm install -g firebase-tools`

### Firebase Setup

#### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "todo-app")
4. Follow the setup wizard

#### 2. Enable Email/Password Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Email/Password**
3. Enable it and click **Save**

#### 3. Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Production mode** (security rules are already configured in `firestore.rules`)
4. Select your preferred location
5. Click **Enable**

#### 4. Get Firebase Configuration

1. In Firebase Console, go to **Project settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click on the **Web** icon (`</>`)
4. Register your app with a nickname
5. Copy the `firebaseConfig` object
6. Open `index.html` and replace the placeholder config at line 578-585:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### Local Development

Simply open `index.html` in your browser. The app will work locally once you've configured Firebase.

## Firebase Hosting Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project:**
   ```bash
   firebase init hosting
   ```

   - Select your existing Firebase project
   - Set the public directory to `.` (current directory)
   - Configure as a single-page app: **Yes**
   - Don't overwrite `index.html`

4. **Deploy Firestore rules and indexes:**
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```

5. **Deploy to Firebase Hosting:**
   ```bash
   firebase deploy --only hosting
   ```

6. **Your app will be live at:**
   ```
   https://YOUR_PROJECT_ID.web.app
   ```

### Updating the App

Whenever you make changes, redeploy with:
```bash
firebase deploy
```

## Firestore Data Model

### Collection: `todos`

Each document has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | User's UID (auto-set) |
| `title` | string | Task title |
| `description` | string/null | Task description |
| `priority` | string | Priority: 'low', 'medium', 'high' |
| `status` | string | Status: 'todo', 'in_progress', 'done' |
| `due_date` | string/null | ISO 8601 date string |
| `notified` | boolean | Notification flag |
| `createdAt` | timestamp | Auto-generated server timestamp |
| `updatedAt` | timestamp | Auto-generated server timestamp |

### Security Rules

Users can only read/write their own tasks. See `firestore.rules` for details.

## Usage

1. **Register/Login:** Create an account or login with email/password
2. **Add Tasks:** Fill in the task form and click "Add Task"
3. **Move Tasks:** Drag and drop tasks between columns, or use the action buttons
4. **Edit Tasks:** Click on a task title or the edit icon
5. **Delete Tasks:** Click the trash icon
6. **Filter/Search:** Use the filters at the top to find specific tasks
7. **Customize:** Click the "Theme" button to change the appearance
8. **Track Progress:** View achievements and streaks in the header

## Troubleshooting

### Firebase Configuration Issues

If you see errors about Firebase not being initialized:
1. Double-check your `firebaseConfig` values in `index.html`
2. Ensure Email/Password authentication is enabled in Firebase Console
3. Verify Firestore database is created

### Permission Denied Errors

If you get "permission denied" errors:
1. Make sure you're logged in
2. Deploy Firestore rules: `firebase deploy --only firestore:rules`
3. Check Firebase Console > Firestore Database > Rules

### Tasks Not Syncing

1. Check your internet connection
2. Open browser console (F12) to see any errors
3. Verify Firebase configuration is correct

## License

This project is open source and available for learning purposes.
