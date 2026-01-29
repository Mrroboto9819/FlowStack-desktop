/**
 * Task store - Manages task state and CRUD operations
 */

import { toastStore } from "../toastStore.svelte.js";
import { tagStore } from "./tags.svelte.js";

const STORAGE_KEY = "taskflow_tasks";

let tasks = $state([]);
let hasHydrated = $state(false);

function newId() {
  return crypto.randomUUID();
}

function removeDuplicates(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function saveTasks() {
  tasks = removeDuplicates(tasks);
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}

export const taskStore = {
  get tasks() {
    return tasks;
  },

  get hasHydrated() {
    return hasHydrated;
  },

  hydrate() {
    if (typeof localStorage === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        tasks = Array.isArray(parsed) ? removeDuplicates(parsed) : [];
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
      tasks = [];
    }

    hasHydrated = true;
  },

  create(taskData) {
    const now = new Date().toISOString();
    const task = {
      id: newId(),
      created: now,
      updated: now,
      ...taskData,
    };

    tasks = [task, ...tasks];
    saveTasks();

    // Add tags to tag store for suggestions
    if (task.tags && Array.isArray(task.tags) && task.tags.length > 0) {
      tagStore.addTags(task.tags);
    }

    toastStore.success("Task created");
    return task;
  },

  update(id, updates) {
    const now = new Date().toISOString();
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updates, updated: now } : task
    );
    saveTasks();

    // Add tags to tag store for suggestions
    if (updates.tags && Array.isArray(updates.tags) && updates.tags.length > 0) {
      tagStore.addTags(updates.tags);
    }

    toastStore.success("Task updated");
  },

  updateStatus(id, newStatus) {
    this.update(id, { status: newStatus });
  },

  delete(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    toastStore.success("Task deleted");
  },

  getById(id) {
    return tasks.find((task) => task.id === id);
  },

  getByStatus(status) {
    return tasks.filter((task) => task.status === status);
  },

  getBySprint(sprintId) {
    return tasks.filter((task) => task.sprintId === sprintId);
  },

  getBacklog() {
    return tasks.filter((task) => task.status === "BACKLOG" || !task.sprintId);
  },

  toggleSubtask(taskId, subtaskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !Array.isArray(task.subtasks)) return;

    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    this.update(taskId, { subtasks: updatedSubtasks });
  },

  startTimer(taskId) {
    // Stop all other running timers
    tasks = tasks.map((task) => {
      if (task.timerRunning && task.id !== taskId) {
        const elapsed = task.elapsedSeconds || 0;
        const startedAt = task.timerStartedAt ? new Date(task.timerStartedAt).getTime() : Date.now();
        const additionalTime = Math.floor((Date.now() - startedAt) / 1000);
        return {
          ...task,
          timerRunning: false,
          elapsedSeconds: elapsed + additionalTime,
          timerStartedAt: null,
        };
      }
      return task;
    });

    // Start the timer for this task
    tasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            timerRunning: true,
            timerStartedAt: new Date().toISOString(),
            elapsedSeconds: task.elapsedSeconds || 0,
          }
        : task
    );
    saveTasks();
    toastStore.info("Timer started");
  },

  pauseTimer(taskId, currentElapsed) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    tasks = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            timerRunning: false,
            elapsedSeconds: currentElapsed,
            timerStartedAt: null,
          }
        : t
    );
    saveTasks();
    toastStore.info("Timer paused");
  },

  resetTimer(taskId) {
    tasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            timerRunning: false,
            elapsedSeconds: 0,
            timerStartedAt: null,
          }
        : task
    );
    saveTasks();
    toastStore.info("Timer reset");
  },

  clear() {
    tasks = [];
    saveTasks();
  },
};
