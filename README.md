# TODO App - Simple Task Manager

A straightforward task management application with a Kanban-style board. Move tasks between "To Do", "In Progress", and "Done" columns.

## Tech Stack

- **Backend:** Python (FastAPI)
- **Frontend:** HTML, JavaScript, Tailwind CSS
- **Database:** SQLite

## Features

- ✅ Add new tasks with title and description
- ✅ Three-column board (To Do, In Progress, Done)
- ✅ Move tasks between columns
- ✅ Delete tasks
- ✅ Responsive design
- ✅ Real-time task counters
- ✅ Clean and modern UI

## Project Structure

```
todo-app/
├── backend/
│   ├── main.py           # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   └── tasks.db          # SQLite database (auto-created)
├── frontend/
│   ├── index.html        # Main HTML page
│   └── app.js            # JavaScript logic
└── README.md
```

## Setup and Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation Steps

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the FastAPI server:**
   ```bash
   python main.py
   ```

   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:8000
   ```

   The frontend will be served automatically by FastAPI.

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

## Usage

1. **Add a Task:** Fill in the title and optional description, then click "Add Task"
2. **Move Tasks:** Click the arrow buttons to move tasks between columns
3. **Delete Tasks:** Click the trash icon to delete a task

## Development

### Running in Development Mode

```bash
cd backend
uvicorn main:app --reload
```

The `--reload` flag enables auto-reload when you make code changes.

### Database

The SQLite database (`tasks.db`) is created automatically on first run. It stores all tasks with the following schema:

- `id` - Auto-incrementing primary key
- `title` - Task title (required)
- `description` - Task description (optional)
- `status` - Current status: 'todo', 'in_progress', or 'done'
- `created_at` - Timestamp when task was created
- `updated_at` - Timestamp when task was last updated

## Future Enhancements (Upcoming Epics)

- User authentication
- Task assignment to team members
- Due dates and priorities
- Task filtering and search
- Dark mode
- PostgreSQL support for production

## License

This project is open source and available for learning purposes.
