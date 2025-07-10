import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { InputField, Drawer } from "../../atoms";
import { evaluateTask, getTaskStatus } from "../../utils/const";
import { useTaskStore } from "../../store";
import { FaEdit, FaTrash, FaCheck, FaUndo, FaPlus } from "react-icons/fa";

dayjs.extend(relativeTime);

export default function SmartTodoList() {
  const {
    tasks,
    loading,
    showAddDrawer,
    newTask,
    setShowAddDrawer,
    setNewTask,
    resetNewTask,
    setEditTaskState,
    setEditingTaskId,
    editingTaskId,
    editTaskState,
    resetEditTask,
    isInputsValid,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    clearField,
  } = useTaskStore();

  const [apiError, setApiError] = useState("");
  const [tab, setTab] = useState("Ongoing");
  const [, setTick] = useState(0);
  const intervalRef = useRef();

  const filteredTasks = tasks.filter((task) => {
    const now = dayjs();
    const deadline = dayjs(task.deadline);

    if (tab === "Ongoing") {
      return !task.isCompleted && deadline.isAfter(now);
    }
    if (tab === "Success") {
      return task.isCompleted;
    }
    if (tab === "Failure") {
      return !task.isCompleted && deadline.isBefore(now);
    }
    return true;
  });

  const handleInputChange = (key, value) => {
    setNewTask(key, value);
  };

  const handleEditInputChange = (key, value) => {
    setEditTaskState(key, value);
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.deadline) {
      setApiError("Title and deadline are required.");
      return;
    }
    setApiError("");
    try {
      await addTask({
        ...newTask,
        deadline: newTask.deadline,
        isCompleted: false,
      });
      resetNewTask();
    } catch (err) {
      console.log(err, "err");
      setApiError("Failed to add task.");
    }
  };

  const handleDeleteTask = async (id) => {
    setApiError("");
    try {
      await removeTask(id);
    } catch (err) {
      console.log(err, "err");
      setApiError("Failed to delete task.");
    }
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task.id);
    setEditTaskState("title", task.title);
    setEditTaskState("description", task.description);
    setEditTaskState(
      "deadline",
      dayjs(task.deadline).format("YYYY-MM-DDTHH:mm")
    );
    setEditTaskState("isCompleted", task.isCompleted);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    resetEditTask();
  };

  const handleSaveEdit = async (id) => {
    if (!editTaskState.title || !editTaskState.deadline) {
      setApiError("Title and deadline are required.");
      return;
    }
    setApiError("");
    try {
      await editTask(id, {
        ...editTaskState,
        deadline: editTaskState.deadline,
      });
      setEditingTaskId(null);
      resetEditTask();
    } catch (err) {
      console.log(err, "err");
      setApiError("Failed to update task.");
    }
  };

  const handleToggleComplete = async (task) => {
    setApiError("");
    try {
      await editTask(task.id, {
        ...task,
        isCompleted: !task.isCompleted,
      });
    } catch (err) {
      console.log(err, "err");
      setApiError("Failed to update task status.");
    }
  };

  const openDrawer = () => {
    setShowAddDrawer(true);
    clearField();
  };
  const closeDrawer = () => {
    setShowAddDrawer(false);
    clearField();
  };

  const onSubmitTask = async (e) => {
    e.preventDefault();
    if (isInputsValid()) {
      await handleAddTask();
      if (!loading && !apiError) setShowAddDrawer(false);
      clearField();
    }
  };

  useEffect(() => {
    fetchTasks();
    intervalRef.current = setInterval(() => {
      setTick((tick) => tick + 1);
    }, 1000 * 60);
    return () => clearInterval(intervalRef.current);
  }, [fetchTasks]);

  return (
    <div className="flex h-[100vh] bg-gray-50 rounded-lg shadow-lg overflow-hidden flex-col md:flex-row">
      {/*Sidebar */}
      <div className="hidden md:flex w-64 bg-white border-r border-r-[#e9e9e9] flex-col p-6">
        <div className="mb-8">
          <button
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-600 transition flex items-center justify-center gap-2"
            onClick={openDrawer}
          >
            <span className="flex items-center">
              <FaPlus className="mr-2" />
            </span>
            CREATE NEW TASK
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {evaluateTask.map((value) => (
            <button
              key={value?.title}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium text-left transition ${
                tab === value?.title
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setTab(value?.title)}
            >
              {value?.title}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile  */}
      <div className="md:hidden w-full bg-white border-b border-b-[#e9e9e9] flex flex-col p-4">
        <div className="flex items-center justify-between px-0 py-6 border-b border-b-[#e9e9e9]  bg-white">
          <h1 className="text-2xl font-bold">Smart Todo List</h1>
          <button
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-600 transition flex items-center justify-center gap-2"
            onClick={openDrawer}
            style={{ width: "194px", height: "42px" }}
          >
            <span className="flex items-center">
              <FaPlus className="mr-2" />
            </span>
            CREATE NEW TASK
          </button>
        </div>
        <div className="mb-4"></div>
        <div className="flex flex-row gap-2 overflow-x-auto">
          {evaluateTask.map((value) => (
            <button
              key={value?.title}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-left transition whitespace-nowrap ${
                tab === value?.title
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setTab(value?.title)}
            >
              {value?.title}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden w-full flex-1 flex flex-col min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-gray-50 w-full">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <span className="animate-spin inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <p className="text-center text-gray-500 mt-12">
              No tasks in this bucket.
            </p>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              {filteredTasks.map((task) => {
                const status = getTaskStatus(task);
                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg shadow p-6 flex flex-col gap-2 border border-gray-200 relative w-full"
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="flex-1 min-w-0 text-start">
                        <h2 className="text-lg font-semibold mb-1">
                          {task.title}
                        </h2>
                        <p className="text-gray-500 text-sm mb-1 truncate max-w-md">
                          {task.description}
                        </p>
                        <span className={`text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {!task.isCompleted && (
                          <button
                            className="text-green-600 hover:bg-green-100 p-2 rounded"
                            title="Mark as Complete"
                            onClick={() => handleToggleComplete(task)}
                          >
                            <FaCheck />
                          </button>
                        )}
                        {task.isCompleted && (
                          <button
                            className="text-yellow-600 hover:bg-yellow-100 p-2 rounded"
                            title="Mark as Ongoing"
                            onClick={() => handleToggleComplete(task)}
                          >
                            <FaUndo />
                          </button>
                        )}
                        <button
                          className="text-blue-600 hover:bg-blue-100 p-2 rounded"
                          title="Edit"
                          onClick={() => handleStartEdit(task)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-600 hover:bg-red-100 p-2 rounded"
                          title="Delete"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    {/* Edit Mode */}
                    {editingTaskId === task.id && (
                      <div className="mt-4 bg-gray-50 p-4 rounded-lg flex flex-col gap-2">
                        <InputField
                          value={editTaskState.title}
                          type="text"
                         className="w-full p-2 border rounded-md"
                          onChange={(e) =>
                            handleEditInputChange("title", e.target.value)
                          }
                          placeholder="Title"
                        />
                        <InputField
                          value={editTaskState.description}
                          type="text"
                         className="w-full p-2 border rounded-md"
                          onChange={(e) =>
                            handleEditInputChange("description", e.target.value)
                          }
                          placeholder="Description"
                        />
                        <InputField
                          value={editTaskState.deadline}
                          type="datetime-local"
                          className="w-full p-2 border rounded-md"
                          onChange={(e) =>
                            handleEditInputChange("deadline", e.target.value)
                          }
                          placeholder="Deadline"
                        />
                        <div className="flex gap-2">
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => handleSaveEdit(task.id)}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content*/}
      <div className="flex-1 flex flex-col hidden md:flex">
        <div className="flex items-center justify-between px-8 py-6 border-b border-b-[#e9e9e9]  bg-white">
          <h1 className="text-2xl font-bold">Smart Todo List</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <span className="animate-spin inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <p className="text-center text-gray-500 mt-12">
              No tasks in this bucket.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredTasks.map((task) => {
                const status = getTaskStatus(task);
                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg shadow p-6 flex flex-col gap-2 border border-gray-200 relative"
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-start">
                        <h2 className="text-lg font-semibold mb-1">
                          {task.title}
                        </h2>
                        <p className="text-gray-500 text-sm mb-1 truncate max-w-md">
                          {task.description}
                        </p>
                        <span className={`text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {!task.isCompleted && (
                          <button
                            className="text-green-600 hover:bg-green-100 p-2 rounded"
                            title="Mark as Complete"
                            onClick={() => handleToggleComplete(task)}
                          >
                            <FaCheck />
                          </button>
                        )}
                        {task.isCompleted && (
                          <button
                            className="text-yellow-600 hover:bg-yellow-100 p-2 rounded"
                            title="Mark as Ongoing"
                            onClick={() => handleToggleComplete(task)}
                          >
                            <FaUndo />
                          </button>
                        )}
                        <button
                          className="text-blue-600 hover:bg-blue-100 p-2 rounded"
                          title="Edit"
                          onClick={() => handleStartEdit(task)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-600 hover:bg-red-100 p-2 rounded"
                          title="Delete"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    {/* Edit Mode */}
                    {editingTaskId === task.id && (
                      <div className="mt-4 bg-gray-50 p-4 rounded-lg flex flex-col gap-2">
                        <InputField
                          value={editTaskState.title}
                          type="text"
                          className="w-full p-2 border rounded-md mb-2"
                          onChange={(e) =>
                            handleEditInputChange("title", e.target.value)
                          }
                          placeholder="Title"
                        />
                        <InputField
                          value={editTaskState.description}
                          type="text"
                          className="w-full p-2 border rounded-md mb-2"
                          onChange={(e) =>
                            handleEditInputChange("description", e.target.value)
                          }
                          placeholder="Description"
                        />
                        <InputField
                          value={editTaskState.deadline}
                          type="datetime-local"
                          className="w-full p-2 border rounded-md mb-2"
                          onChange={(e) =>
                            handleEditInputChange("deadline", e.target.value)
                          }
                          placeholder="Deadline"
                        />
                        <div className="flex gap-2">
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => handleSaveEdit(task.id)}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Drawer isOpen={showAddDrawer} onClose={closeDrawer} title="Add New Task">
        <div
          className="mx-auto p-4 flex flex-col w-full"
          style={{ maxWidth: 600, minHeight: 0 }}
        >
          <form
            className="flex flex-col gap-3 w-full"
            style={{ flex: "1 1 auto", minHeight: 0 }}
            onSubmit={onSubmitTask}
          >
            <div>
              <InputField
                title={newTask.title}
                placeholder="Enter your task"
                className="w-full p-2 border rounded-md"
                value={newTask.title}
                type="text"
                onChange={(e) => handleInputChange("title", e?.target?.value)}
                error={newTask?.error?.title}
              />
              {newTask?.error?.title && (
                <div className="text-red-500 text-sm mt-1">
                  {newTask.error.title}
                </div>
              )}
            </div>
            <InputField
              title={newTask.description}
              placeholder="Description (optional)"
              className="w-full p-2 border rounded-md"
              value={newTask.description}
              type="text"
              onChange={(e) =>
                handleInputChange("description", e?.target?.value)
              }
            />
            <div>
              <InputField
                title={newTask.deadline}
                placeholder="Enter your deadline"
                className="w-full p-2 border rounded-md"
                // value={dayjs(newTask.taskDeadline).format("YYYY-MM-DDTHH:mm")}
                value={newTask.taskDeadline}
                type="datetime-local"
                onChange={(e) =>
                  handleInputChange("deadline", e?.target?.value)
                }
                error={newTask?.error?.deadline}
              />
              {newTask?.error?.deadline && (
                <div className="text-red-500 text-sm mt-1">
                  {newTask.error.deadline}
                </div>
              )}
            </div>
            <div className="w-full flex absolute left-0 bottom-0 gap-3 justify-center mt-6 mb-2 px-4">
              <button
                className="bg-blue-500 text-white px-5 py-2 rounded-md shadow w-full"
                style={{ width: "294px", height: "42px" }}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-blue-500 rounded-full"></span>
                ) : (
                  "Add Task"
                )}
              </button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
}
