import { z } from "zod";

export const taskSchema = z.object({
  task_id: z.string().uuid(),
  date: z.string(), // YYYY-MM-DD
  cutoff_date: z.string().optional(),
  title: z.string().min(1),
  priority: z.enum(['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']),
  status: z.enum(['pending', 'completed', 'carried_over']),
  due_time: z.string().optional(),
  category: z.string().optional(),
  notes: z.string().optional(),
  created_at: z.string(), // ISO string
  updated_at: z.string(), // ISO string
});

export type Task = z.infer<typeof taskSchema>;
