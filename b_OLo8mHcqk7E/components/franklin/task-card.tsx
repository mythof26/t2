"use client"

import { motion } from "framer-motion"
import { Clock, CheckCircle2 } from "lucide-react"

interface Task {
  task_id: string
  title: string
  priority: string
  due_time: string
  date: string
  cutoff_date: string
  completed?: boolean
}

interface TaskCardProps {
  task: Task
  index: number
  isHero?: boolean
}

export function TaskCard({ task, index, isHero = false }: TaskCardProps) {
  const priorityColors: Record<string, string> = {
    A: "bg-[#007AFF] text-white",
    B: "bg-[#34C759] text-white",
    C: "bg-[#FF9500] text-white",
  }

  const priorityLetter = task.priority.charAt(0).toUpperCase()
  const priorityColor = priorityColors[priorityLetter] || "bg-gray-400 text-white"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        bg-white rounded-[20px] p-5
        shadow-[0_8px_30px_rgb(0,0,0,0.04)]
        hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]
        transition-shadow duration-300
        cursor-pointer
        ${isHero ? "ring-1 ring-[#007AFF]/20" : ""}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Priority Badge */}
          <div className="flex items-center gap-3 mb-3">
            <span 
              className={`
                inline-flex items-center justify-center
                px-2.5 py-1 rounded-full text-xs font-medium
                ${priorityColor}
              `}
            >
              <span className="font-serif font-semibold">{task.priority}</span>
            </span>
            {isHero && (
              <span className="text-xs font-medium text-[#007AFF] bg-[#007AFF]/10 px-2 py-0.5 rounded-full">
                Top Priority
              </span>
            )}
          </div>

          {/* Task Title */}
          <h3 className="text-base font-semibold text-gray-900 mb-2 leading-snug">
            {task.title}
          </h3>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-[13px] text-gray-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{task.due_time}</span>
            </div>
            <span className="text-gray-300">|</span>
            <span>Due: {task.cutoff_date}</span>
          </div>
        </div>

        {/* Completion Status */}
        <button 
          className={`
            flex-shrink-0 w-7 h-7 rounded-full
            flex items-center justify-center
            transition-colors duration-200
            ${task.completed 
              ? "bg-[#34C759] text-white" 
              : "border-2 border-gray-200 text-transparent hover:border-[#007AFF]"
            }
          `}
        >
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
