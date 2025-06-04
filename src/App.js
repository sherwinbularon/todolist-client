import React, { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api";
import { Toaster, toast } from "react-hot-toast";
import { TrashIcon, PlusIcon,} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import "./tailwind.css";

function TaskItem({ task, onToggle, onDelete, onEdit, isEditing, editingTitle, setEditingTitle, handleUpdate }) {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => onDelete(task.id),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <motion.li
      {...swipeHandlers}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="group flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3"
    >
      <div className="flex items-center gap-2 flex-1">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
          className="accent-blue-600"
        />
        {isEditing ? (
          <input
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onBlur={() => handleUpdate(task)}
            className="bg-transparent border-b border-gray-400 text-sm w-full text-gray-800 dark:text-white focus:outline-none"
            autoFocus
          />
        ) : (
          <span
            onClick={() => onEdit(task)}
            className={`text-sm flex-1 cursor-pointer transition ${
              task.completed ? "line-through text-gray-400" : "text-gray-900 dark:text-white"
            }`}
          >
            {task.title}
          </span>
        )}
      </div>
      <button onClick={() => onDelete(task.id)} className="text-red-500 hover:text-red-600">
        <TrashIcon className="w-5 h-5" />
      </button>
    </motion.li>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch {
      toast.error("Failed to load tasks.");
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      toast.error("Task title cannot be empty.");
      return;
    }
    try {
      await createTask({ title: newTitle });
      toast.success("Task added!");
      setNewTitle("");
      loadTasks();
    } catch {
      toast.error("Failed to create task.");
    }
  };

  const handleUpdate = async (task) => {
    try {
      await updateTask(task.id, { ...task, title: editingTitle });
      toast.success("Task updated!");
      setEditingId(null);
      setEditingTitle("");
      loadTasks();
    } catch {
      toast.error("Failed to update task.");
    }
  };

  const handleToggle = async (task) => {
    try {
      await updateTask(task.id, { ...task, completed: !task.completed });
      loadTasks();
    } catch {
      toast.error("Failed to update task.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      toast.success("Task deleted!");
      loadTasks();
    } catch {
      toast.error("Failed to delete task.");
    }
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-900 dark:to-black transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 m-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">To-Do List</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm text-blue-500 dark:text-yellow-400"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="flex gap-2 mb-4 relative">
          <input
            id="floating-input"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder=" "
            className="block rounded-md px-4 pt-5 pb-2 w-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
          />
          <label
            htmlFor="floating-input"
            className="absolute left-3 top-2.5 text-sm text-gray-500 dark:text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm"
          >
            Add your task
          </label>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-1"
          >
            <PlusIcon className="w-5 h-5" /> Add
          </button>
        </div>

        <ul className="space-y-2">
          <AnimatePresence>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
                isEditing={editingId === task.id}
                editingTitle={editingTitle}
                setEditingTitle={setEditingTitle}
                handleUpdate={handleUpdate}
              />
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
