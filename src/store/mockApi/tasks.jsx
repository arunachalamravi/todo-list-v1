
import axios from "axios";
import dayjs from "dayjs";
import { create } from "zustand";

const BASE_URL = "https://686e5bffc9090c4953895434.mockapi.io/api/v1/tasks";

export const getTasks = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const createTask = async (task) => {
  const res = await axios.post(BASE_URL, task);
  return res.data;
};

export const updateTask = async (id, updatedTask) => {
  const res = await axios.put(`${BASE_URL}/${id}`, updatedTask);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};

const emptyTask = {
  title: "",
  description: "",
  deadline: dayjs().format("YYYY-MM-DDTHH:mm") ?? '',
  isCompleted: false,
  error: {
    title: "",
    deadline: "",
  },
};

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  showAddDrawer: false,
  newTask: { ...emptyTask },
  editTaskState: { ...emptyTask },
  editingTaskId: null,

  setShowAddDrawer: (open) => set({ showAddDrawer: open }),

  setNewTask: (key, value) =>
    set((state) => ({
      newTask: { ...state.newTask, [key]: value },
    })),

  resetNewTask: () => set({ newTask: { ...emptyTask } }),

  setEditTaskState: (key, value) =>
    set((state) => ({
      editTaskState: { ...state.editTaskState, [key]: value },
    })),

  setEditingTaskId: (id) => set({ editingTaskId: id }),

  resetEditTask: () =>
    set({ editTaskState: { ...emptyTask }, editingTaskId: null }),

  isInputsValid: () => {
    const { newTask } = get();
    let isValid = true;
    const error = {};

    if (!newTask?.title || newTask.title.trim() === "") {
      isValid = false;
      error["title"] = "Enter a Title";
    } else {
      error["title"] = "";
    }

    // if (!newTask?.deadline || newTask.deadline.trim() === "") {
    //   isValid = false;
    //   error["deadline"] = "Select a date & time";
    // } else {
    //   error["deadline"] = "";
    // }
    set({
      newTask: {
        ...newTask,
        error,
      },
    });
    return isValid;
  },

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getTasks();
      console.log(data, "data");
      set({ tasks: data, loading: false });
    } catch (err) {
      console.log(err,'err')
      set({ error: "Failed to load tasks.", loading: false });
    }
  },

  addTask: async (task) => {
    set({ loading: true, error: null });
    try {
      await createTask(task);
      await get().fetchTasks();
      set({ loading: false });
    } catch (err) {
      console.log(err,'err')
      set({ error: "Failed to add task.", loading: false });
    }
  },

  editTask: async (id, updatedTask) => {
    set({ loading: true, error: null });
    try {
      await updateTask(id, updatedTask);
      await get().fetchTasks();
      set({ loading: false });
    } catch (err) {
      console.log(err,'err')
      set({ error: "Failed to update task.", loading: false });
    }
  },

  removeTask: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteTask(id);
      await get().fetchTasks();
      set({ loading: false });
    } catch (err) {
      console.log(err,'err')
      set({ error: "Failed to delete task.", loading: false });
    }
  },

  clearError: () => set({ error: null }),

  clearField:()=>{
    const { newTask } = get();

    set(({
      newTask: {
          ...newTask,
          title: "",
          description: "",
          deadline: "",
          isCompleted: false,
          error: {
            title: "",
            deadline: "",
          },
        },
    
    }));
  }
}));
