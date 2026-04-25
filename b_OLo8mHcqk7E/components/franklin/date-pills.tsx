"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const dates = [
  { day: "Mon", date: 21 },
  { day: "Tue", date: 22 },
  { day: "Wed", date: 23, isToday: true },
  { day: "Thu", date: 24 },
  { day: "Fri", date: 25 },
  { day: "Sat", date: 26 },
  { day: "Sun", date: 27 },
]

export function DatePills() {
  const [selectedDate, setSelectedDate] = useState(23)

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4 -mx-4 scrollbar-hide">
      {dates.map((item, index) => {
        const isSelected = selectedDate === item.date

        return (
          <motion.button
            key={item.date}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedDate(item.date)}
            className={`
              flex flex-col items-center justify-center
              min-w-[52px] h-[72px] rounded-2xl
              transition-all duration-200
              ${isSelected 
                ? "bg-[#007AFF] text-white shadow-lg shadow-[#007AFF]/30" 
                : "bg-white text-gray-600 shadow-[0_4px_15px_rgb(0,0,0,0.04)]"
              }
            `}
          >
            <span className={`text-[11px] font-medium ${isSelected ? "text-white/80" : "text-gray-400"}`}>
              {item.day}
            </span>
            <span className={`text-lg font-semibold mt-0.5 ${isSelected ? "text-white" : "text-gray-900"}`}>
              {item.date}
            </span>
            {item.isToday && !isSelected && (
              <div className="w-1 h-1 rounded-full bg-[#007AFF] mt-1" />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
