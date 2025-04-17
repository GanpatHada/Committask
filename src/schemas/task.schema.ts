import { z } from "zod";

const Priority = z.enum(["LOW", "MEDIUM", "HIGH"], {
  errorMap: () => ({
    message: "Priority must be one of 'LOW', 'MEDIUM', or 'HIGH'",
  }),
});

export const addTodoSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }).min(1, "Title cannot be empty"),

  description: z.string({
    required_error: "Description is required",
  }).min(1, "Description cannot be empty"),

  priority: Priority.default("MEDIUM"),

  dueDate: z.string({
    required_error: "Due date is required",
    invalid_type_error: "Due date must be a string",
  }).refine((val) => !isNaN(Date.parse(val)), {
    message: "Due date must be a valid date",
  }),
}).strict();

export const deleteTodoSchema = z.object({
  todoId: z.string({
    required_error: "Todo ID is required",
  }).min(1, "Todo ID can not be empty"),
});

