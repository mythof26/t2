"use client"

import { useMemo, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Header } from "@/components/franklin/header"
import { TabBar } from "@/components/franklin/tab-bar"
import { TaskCard } from "@/components/franklin/task-card"
import { DatePills } from "@/components/franklin/date-pills"
import { ProgressRing } from "@/components/franklin/progress-ring"
import { TrendingUp, CopyPlus } from "lucide-react"
import { AddTaskModal } from "@/components/franklin/add-task-modal"
import { useTasks } from "@/hooks/use-tasks"
import { getTodayDateString } from "@/lib/date-utils"
import { format, parseISO } from "date-fns"

function DailyFocusContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const today = getTodayDateString()
  const selectedDate = searchParams.get('date') || today

  const {
    tasks,
    isLoaded,
    createTask,
    toggleComplete,
    carryOverIncompleteTasks,
    sortTasks
  } = useTasks()

  // Expose dev helpers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__clearTasks = () => {
        localStorage.removeItem('franklin-diary:tasks');
        window.location.reload();
      };
      (window as any).__seedTasks = () => {
        const seedTasks = [
          {
            task_id: crypto.randomUUID(),
            date: today,
            title: "팀 미팅",
            priority: "A1",
            status: "pending",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            task_id: crypto.randomUUID(),
            date: today,
            title: "보고서 작성",
            priority: "B1",
            status: "completed",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ];
        localStorage.setItem('franklin-diary:tasks', JSON.stringify(seedTasks));
        window.location.reload();
      };
    }
  }, [today]);

  const handleDateChange = (date: string) => {
    router.push(`/?date=${date}`)
  }

  const handleAddTask = (title: string) => {
    createTask({
      title,
      priority: 'B2',
      status: 'pending',
      date: selectedDate,
    })
  }

  const displayTasks = useMemo(() => {
    const filtered = tasks.filter(t => t.date === selectedDate)
    return sortTasks(filtered)
  }, [tasks, selectedDate, sortTasks])

  const completedTasksCount = displayTasks.filter(t => t.status === 'completed').length
  const progress = displayTasks.length === 0 ? 0 : Math.round((completedTasksCount / displayTasks.length) * 100)

  const formattedDate = useMemo(() => {
    try {
      return format(parseISO(selectedDate), 'EEEE, MMMM d')
    } catch {
      return selectedDate
    }
  }, [selectedDate])

  const topPriorityTask = displayTasks.find(t => t.priority.startsWith('A') && t.status === 'pending') || displayTasks[0]

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Header 
        title="Daily Focus" 
        subtitle={formattedDate}
      />

      {/* Main Content */}
      <main className="pt-32 pb-28 px-4">
        {/* Date Selector */}
        <section className="mb-6">
          <DatePills selectedDate={selectedDate} onSelectDate={handleDateChange} />
        </section>

        {/* Carry Over Action */}
        {selectedDate < today && (
          <button 
            onClick={() => carryOverIncompleteTasks(selectedDate)}
            className="mb-6 w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 rounded-2xl shadow-sm text-sm font-medium active:scale-95 transition-transform"
          >
            <CopyPlus className="w-4 h-4" />
            어제 미완료 할 일 오늘로 가져오기
          </button>
        )}

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
                {completedTasksCount} of {displayTasks.length} tasks completed
              </p>
              
              <div className="flex items-center gap-2 text-[13px]">
                <div className="flex items-center gap-1.5 text-[#34C759]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">{progress}%</span>
                </div>
                <span className="text-gray-400">completion rate</span>
              </div>
            </div>
            
            <ProgressRing progress={progress} size={100} strokeWidth={8} />
          </div>
        </motion.section>

        {/* Priority Tasks Section */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Tasks for {selectedDate}
            </h2>
          </div>

          <div className="space-y-3">
            {displayTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                할 일이 없습니다. + 버튼을 눌러 추가해보세요.
              </div>
            ) : (
              displayTasks.map((task, index) => (
                <TaskCard 
                  key={task.task_id} 
                  task={task} 
                  index={index} 
                  isHero={task.task_id === topPriorityTask?.task_id}
                  onToggle={toggleComplete}
                />
              ))
            )}
          </div>
        </section>

      </main>

      {isLoaded && <AddTaskModal onAdd={handleAddTask} />}
      <TabBar />
    </div>
  )
}

export default function DailyFocusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F7]" />}>
      <DailyFocusContent />
    </Suspense>
  )
}
