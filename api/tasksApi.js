import api from "./vkserfingApi";

// Получить список доступных заданий
export async function getTasks() {
  const res = await api.get("/tasks.list");
  return res.data.tasks;
}

// Выполнить задание
export async function completeTask(taskId) {
  const res = await api.post("/tasks.complete", { task_id: taskId });
  return res.data;
}
