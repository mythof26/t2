"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Plus, Search } from "lucide-react"

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const { scrollY } = useScroll()
  
  const titleScale = useTransform(scrollY, [0, 80], [1, 0.8])
  const titleY = useTransform(scrollY, [0, 80], [0, -10])
  const opacity = useTransform(scrollY, [0, 60], [1, 0])
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.7])

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-12 pb-4"
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <motion.div 
        className="absolute inset-0 bg-[#F5F5F7]"
        style={{ opacity: bgOpacity }}
      />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <motion.h1 
            className="text-[34px] font-bold text-gray-900 leading-tight"
            style={{ 
              scale: titleScale,
              y: titleY,
              transformOrigin: "left center"
            }}
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p 
              className="text-[15px] text-gray-500 mt-1"
              style={{ opacity }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-xl flex items-center justify-center shadow-sm hover:bg-white transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </motion.header>
  )
}
