"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/franklin/header"
import { TabBar } from "@/components/franklin/tab-bar"
import { TaskCard } from "@/components/franklin/task-card"
import { DatePills } from "@/components/franklin/date-pills"
import { ProgressRing } from "@/components/franklin/progress-ring"
import { TrendingUp } from "lucide-react"

// Sample data matching Franklin Planner structure
const tasks = [
  {
    task_id: "1",
    title: "Complete quarterly report presentation for stakeholders",
    priority: "A1",
    due_time: "9:00 AM",
    date: "2024-01-23",
    cutoff_date: "Jan 23",
    completed: false,
  },
  {
    task_id: "2",
    title: "Review and approve marketing budget proposal",
    priority: "A2",
    due_time: "11:30 AM",
    date: "2024-01-23",
    cutoff_date: "Jan 23",
    completed: true,
  },
  {
    task_id: "3",
    title: "Team sync meeting - Project Alpha updates",
    priority: "B1",
    due_time: "2:00 PM",
    date: "2024-01-23",
    cutoff_date: "Jan 24",
    completed: false,
  },
  {
    task_id: "4",
    title: "Call vendor for contract negotiation",
    priority: "B2",
    due_time: "3:30 PM",
    date: "2024-01-23",
    cutoff_date: "Jan 25",
    completed: false,
  },
  {
    task_id: "5",
    title: "Update project timeline in system",
    priority: "C1",
    due_time: "5:00 PM",
    date: "2024-01-23",
    cutoff_date: "Jan 26",
    completed: false,
  },
]

export default function DailyFocusPage() {
  const completedTasks = tasks.filter(t => t.completed).length
  const progress = Math.round((completedTasks / tasks.length) * 100)

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Header 
        title="Daily Focus" 
        subtitle="Wednesday, January 23"
      />

      {/* Main Content */}
      <main className="pt-32 pb-28 px-4">
        {/* Date Selector */}
        <section className="mb-6">
          <DatePills />
        </section>

        {/* Progress Overview */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[24px] p-6 mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Today&apos;s Progress
              </h2>
              <p className="text-[13px] text-gray-500 mb-4">
                {completedTasks} of {tasks.length} tasks completed
              </p>
              
              <div className="flex items-center gap-2 text-[13px]">
                <div className="flex items-center gap-1.5 text-[#34C759]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">+12%</span>
                </div>
                <span className="text-gray-400">vs yesterday</span>
              </div>
            </div>
            
            <ProgressRing progress={progress} size={100} strokeWidth={8} />
          </div>
        </motion.section>

        {/* Priority Tasks Section */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Priority Tasks
            </h2>
            <button className="text-[13px] font-medium text-[#007AFF]">
              See All
            </button>
          </div>

          {/* Hero Card - Top Priority */}
          <div className="mb-4">
            <TaskCard task={tasks[0]} index={0} isHero />
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {tasks.slice(1).map((task, index) => (
              <TaskCard key={task.task_id} task={task} index={index + 1} />
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: "A Priority", value: "2", color: "#007AFF" },
            { label: "B Priority", value: "2", color: "#34C759" },
            { label: "C Priority", value: "1", color: "#FF9500" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-4 text-center shadow-[0_4px_15px_rgb(0,0,0,0.04)]"
            >
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-[11px] text-gray-500 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.section>
      </main>

      <TabBar />
    </div>
  )
}
