# Setup Guide - TODO App

## Prerequisites

You need Python 3.8+ with pip installed.

## Installation Steps

### 1. Install pip (if not already installed)

For Ubuntu/Debian:
```bash
sudo apt update
sudo apt install python3-pip
```

For other systems, check: https://pip.pypa.io/en/stable/installation/

### 2. Install Python Dependencies

Navigate to the backend directory:
```bash
cd "/home/pavel/To Do/todo-app/backend"
```

Install the required packages:
```bash
pip3 install -r requirements.txt
```

Or install manually:
```bash
pip3 install fastapi uvicorn pydantic
```

### 3. Start the Server

```bash
python3 main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Access the Application

Open your web browser and go to:
```
http://localhost:8000
```

## Troubleshooting

### Issue: "No module named pip"

**Solution:** Install pip first:
```bash
sudo apt update
sudo apt install python3-pip
```

### Issue: "Module not found" errors

**Solution:** Install dependencies:
```bash
pip3 install fastapi uvicorn pydantic
```

### Issue: Port 8000 already in use

**Solution:** Use a different port:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

Then access at: http://localhost:8080

### Issue: CORS errors in browser console

**Solution:** Make sure the backend is running and the API_URL in `frontend/app.js` matches your server URL.

## Verifying Installation

1. **Check if server is running:**
   Visit http://localhost:8000/api/tasks in your browser
   You should see: `[]` (empty array)

2. **Check browser console:**
   Open browser DevTools (F12) and check for errors

## Features to Test

Once running:
- ✅ Add a new task
- ✅ Drag a task between columns
- ✅ Click the pencil icon to edit a task
- ✅ Click the trash icon to delete a task
- ✅ See empty state when columns have no tasks

## Database

The app uses SQLite and creates a `tasks.db` file automatically in the backend directory.

To reset the database, simply delete `tasks.db` and restart the server.
