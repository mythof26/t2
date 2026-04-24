import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { Task, taskSchema } from '@/lib/schemas';
import { getSeoulISOString, getTodayDateString } from '@/lib/date-utils';

const STORAGE_KEY = 'franklin-diary:tasks';

const priorityOrder: Record<Task['priority'], number> = {
  'A1': 1, 'A2': 2, 'A3': 3,
  'B1': 4, 'B2': 5, 'B3': 6,
  'C1': 7, 'C2': 8, 'C3': 9,
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(taskSchema).safeParse(parsed);
        if (validated.success) {
          setTasks(validated.data);
        } else {
          console.error("Task data validation failed", validated.error);
          toast.error("데이터가 손상되어 초기화했습니다.");
          setTasks([]);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error("Failed to parse tasks from localStorage", e);
      toast.error("데이터가 손상되어 초기화했습니다.");
      setTasks([]);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever tasks change, but only after initial load
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const createTask = useCallback((taskData: Omit<Task, 'task_id' | 'created_at' | 'updated_at'>) => {
    const newTask: Task = {
      ...taskData,
      task_id: crypto.randomUUID(),
      created_at: getSeoulISOString(),
      updated_at: getSeoulISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Omit<Task, 'task_id' | 'created_at' | 'updated_at'>>) => {
    setTasks(prev => prev.map(t => 
      t.task_id === taskId 
        ? { ...t, ...updates, updated_at: getSeoulISOString() } 
        : t
    ));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(t => t.task_id !== taskId));
  }, []);

  const toggleComplete = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.task_id === taskId) {
        const newStatus = t.status === 'completed' ? 'pending' : 'completed';
        return { ...t, status: newStatus, updated_at: getSeoulISOString() };
      }
      return t;
    }));
  }, []);

  const carryOverIncompleteTasks = useCallback((fromDate: string) => {
    const today = getTodayDateString();
    if (fromDate >= today) return; // Can't carry over from today or future

    setTasks(prev => {
      const newTasks = [...prev];
      let carriedOverCount = 0;

      prev.forEach((t, i) => {
        if (t.date === fromDate && t.status === 'pending') {
          // Mark old task as carried_over
          newTasks[i] = { ...t, status: 'carried_over', updated_at: getSeoulISOString() };
          
          // Create new task for today
          newTasks.push({
            ...t,
            task_id: crypto.randomUUID(),
            date: today,
            status: 'pending',
            created_at: getSeoulISOString(),
            updated_at: getSeoulISOString()
          });
          carriedOverCount++;
        }
      });
      
      if (carriedOverCount > 0) {
        toast.success(`${carriedOverCount}개의 미완료 할 일을 오늘로 가져왔습니다.`);
      } else {
        toast.info(`가져올 미완료 할 일이 없습니다.`);
      }

      return newTasks;
    });
  }, []);

  // Sort function to export
  const sortTasks = useCallback((tasksToSort: Task[]) => {
    return [...tasksToSort].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }, []);

  return {
    tasks,
    isLoaded,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    carryOverIncompleteTasks,
    sortTasks
  };
}
