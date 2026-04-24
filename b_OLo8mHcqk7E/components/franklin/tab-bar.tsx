"use client"

import { motion } from "framer-motion"
import { Home, Calendar, CheckCircle, Settings } from "lucide-react"
import { useState } from "react"

const tabs = [
  { id: "home", icon: Home, label: "Today" },
  { id: "calendar", icon: Calendar, label: "Schedule" },
  { id: "tasks", icon: CheckCircle, label: "Tasks" },
  { id: "settings", icon: Settings, label: "Settings" },
]

export function TabBar() {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-3"
      style={{
        background: "linear-gradient(to top, rgba(245, 245, 247, 0.95), rgba(245, 245, 247, 0.8))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center gap-1 py-1 px-4 transition-colors"
            >
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 transition-colors duration-200 ${
                    isActive ? "text-[#007AFF]" : "text-gray-400"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#007AFF]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span 
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? "text-[#007AFF]" : "text-gray-400"
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
