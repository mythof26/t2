"use client"

import { motion } from "framer-motion"
import { useMemo, useEffect, useRef } from "react"
import { addDays, format, parseISO, isSameDay } from "date-fns"
import { getSeoulDate, getTodayDateString } from "@/lib/date-utils"

interface DatePillsProps {
  selectedDate: string // YYYY-MM-DD
  onSelectDate: (date: string) => void
}

export function DatePills({ selectedDate, onSelectDate }: DatePillsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const dates = useMemo(() => {
    let baseDate: Date;
    try {
      baseDate = parseISO(selectedDate)
    } catch {
      baseDate = getSeoulDate()
    }

    const todayDateStr = getTodayDateString()
    
    // Generate 7 days: 3 days before, selected, 3 days after
    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(baseDate, i - 3)
      const dateStr = format(d, 'yyyy-MM-dd')
      return {
        dateStr,
        dayName: format(d, 'EEE'),
        dayNumber: format(d, 'd'),
        isToday: dateStr === todayDateStr
      }
    })
  }, [selectedDate])

  // Center the selected date on mount or when it changes
  useEffect(() => {
    if (containerRef.current) {
      const selectedBtn = containerRef.current.querySelector('[data-selected="true"]')
      if (selectedBtn) {
        selectedBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [selectedDate])

  return (
    <div ref={containerRef} className="flex gap-2 overflow-x-auto pb-2 px-4 -mx-4 scrollbar-hide">
      {dates.map((item, index) => {
        const isSelected = selectedDate === item.dateStr

        return (
          <motion.button
            key={item.dateStr}
            data-selected={isSelected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectDate(item.dateStr)}
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
              {item.dayName}
            </span>
            <span className={`text-lg font-semibold mt-0.5 ${isSelected ? "text-white" : "text-gray-900"}`}>
              {item.dayNumber}
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
