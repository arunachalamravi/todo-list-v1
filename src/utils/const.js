import dayjs from "dayjs";

export const evaluateTask = [
  {
    title: "Ongoing",
    value: "Ongoing",
  },
  {
    title: "Success",
    value: "Success",
  },
  {
    title: "Failure",
    value: "Failure",
  },
];

export const getTaskStatus=(task)=> {
  if (task.isCompleted) return { label: "Completed", color: "text-green-600" };
  const now = dayjs();
  const deadline = dayjs(task.deadline);
  if (deadline.isBefore(now)) {
    const overdue = now.to(deadline, true);
    return { label: `Overdue by ${overdue}`, color: "text-red-600" };
  } else {
    const due = deadline.to(now, true);
    return { label: `Due in ${due}`, color: "text-blue-600" };
  }
}
