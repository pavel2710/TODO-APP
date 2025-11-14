from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List
import sqlite3
from datetime import datetime
import os

app = FastAPI(title="TODO App API")

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DB_PATH = "tasks.db"

def init_db():
    """Initialize the database with tasks table"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'todo',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Pydantic models
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "todo"

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class Task(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    created_at: str
    updated_at: str

# API Endpoints
@app.get("/")
async def root():
    return {"message": "TODO App API", "version": "1.0"}

@app.get("/api/tasks", response_model=List[Task])
async def get_tasks():
    """Get all tasks"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks ORDER BY created_at DESC")
    tasks = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return tasks

@app.get("/api/tasks/{task_id}", response_model=Task)
async def get_task(task_id: int):
    """Get a specific task by ID"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    task = cursor.fetchone()
    conn.close()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return dict(task)

@app.post("/api/tasks", response_model=Task, status_code=201)
async def create_task(task: TaskCreate):
    """Create a new task"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)",
        (task.title, task.description, task.status)
    )
    conn.commit()
    task_id = cursor.lastrowid

    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    new_task = dict(cursor.fetchone())
    conn.close()

    return new_task

@app.put("/api/tasks/{task_id}", response_model=Task)
async def update_task(task_id: int, task: TaskUpdate):
    """Update a task"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Check if task exists
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    existing_task = cursor.fetchone()
    if not existing_task:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")

    # Build update query dynamically
    update_fields = []
    values = []

    if task.title is not None:
        update_fields.append("title = ?")
        values.append(task.title)
    if task.description is not None:
        update_fields.append("description = ?")
        values.append(task.description)
    if task.status is not None:
        update_fields.append("status = ?")
        values.append(task.status)

    if update_fields:
        update_fields.append("updated_at = CURRENT_TIMESTAMP")
        values.append(task_id)
        query = f"UPDATE tasks SET {', '.join(update_fields)} WHERE id = ?"
        cursor.execute(query, values)
        conn.commit()

    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    updated_task = dict(cursor.fetchone())
    conn.close()

    return updated_task

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: int):
    """Delete a task"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")

    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()

    return {"message": "Task deleted successfully"}

# Mount static files (frontend)
if os.path.exists("../frontend"):
    app.mount("/", StaticFiles(directory="../frontend", html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
