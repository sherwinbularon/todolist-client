const API_URL = process.env.REACT_APP_API_URL;

// GET all tasks
export async function getTasks() {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

// CREATE a task
export async function createTask(task) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

// UPDATE a task
export async function updateTask(id, task) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

// DELETE a task
export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete task");
}