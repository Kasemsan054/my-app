"use client"

import { useState, useRef, useEffect, InputHTMLAttributes } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'

interface DateProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue'> {
  label?: string
  name?: string
  value?: string
  defaultValue?: string
  onChange?: (e: { target: { name?: string; value: string } }) => void
  disabled?: boolean
  required?: boolean
  className?: string
}

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

const WEEKDAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

function toIsoString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseIsoString(str?: string): Date {
  if (!str) return new Date()
  const parts = str.split('-')
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10) - 1
    const d = parseInt(parts[2], 10)
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return new Date(y, m, d)
    }
  }
  return new Date()
}

function formatThaiDateDisplay(date: Date): string {
  const day = date.getDate()
  const month = THAI_MONTHS[date.getMonth()]
  const yearBE = date.getFullYear() + 543
  return `${day} ${month} ${yearBE}`
}

export function DatePickerField({
  label,
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  disabled = false,
  required = false,
  className = ''
}: DateProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const initialIso = controlledValue || defaultValue || toIsoString(new Date())
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date>(parseIsoString(initialIso))
  const [viewDate, setViewDate] = useState<Date>(parseIsoString(initialIso))
  
  const selectedDate = controlledValue ? parseIsoString(controlledValue) : internalSelectedDate
  const containerRef = useRef<HTMLDivElement>(null)

  // Close popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentIso = toIsoString(selectedDate)

  const handleSelectDate = (d: Date) => {
    setInternalSelectedDate(d)
    setViewDate(d)
    setIsOpen(false)
    const iso = toIsoString(d)
    if (onChange) {
      onChange({ target: { name, value: iso } })
    }
  }

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const handleSelectToday = () => {
    const today = new Date()
    handleSelectDate(today)
  }

  // Calendar Grid calculation
  const viewYear = viewDate.getFullYear()
  const viewMonth = viewDate.getMonth()
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const todayIso = toIsoString(new Date())

  return (
    <div className={`w-full space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Hidden input for HTML form submissions */}
      <input type="hidden" name={name} value={currentIso} required={required} />

      <div className="relative w-full">
        {/* Trigger Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            w-full h-11 flex items-center justify-between px-4 py-2.5 rounded-2xl border text-xs font-semibold transition-all text-left cursor-pointer
            ${disabled 
              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
              : isOpen 
                ? 'bg-white border-brand-primary ring-4 ring-blue-600/10 text-slate-900 shadow-xs' 
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-white'
            }
          `}
        >
          <span className="font-bold text-xs text-slate-900 truncate">
            {formatThaiDateDisplay(selectedDate)}
          </span>
          <CalendarIcon
            size={16}
            className={`transition-colors shrink-0 ml-2 ${isOpen ? 'text-brand-primary' : 'text-slate-400'}`}
          />
        </button>

        {/* Minimal Calendar Popover */}
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl p-4 animate-in fade-in-0 zoom-in-95 duration-150">
            {/* Header: Month/Year navigation */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer"
                title="เดือนก่อนหน้า"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="text-xs font-extrabold text-slate-800">
                {THAI_MONTHS[viewMonth]} {viewYear + 543}
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer"
                title="เดือนถัดไป"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 text-center mb-1">
              {WEEKDAYS.map((wd, i) => (
                <div key={wd} className={`text-[11px] font-bold py-1 ${i === 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                  {wd}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Empty padding days for week start */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1
                const dateObj = new Date(viewYear, viewMonth, dayNum)
                const dateIso = toIsoString(dateObj)
                const isSelected = dateIso === currentIso
                const isToday = dateIso === todayIso

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => handleSelectDate(dateObj)}
                    className={`
                      h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer relative
                      ${isSelected
                        ? 'bg-brand-primary text-white shadow-xs'
                        : isToday
                          ? 'bg-brand-primary-light text-brand-primary-hover border border-brand-primary-border/80 hover:bg-brand-primary-light'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }
                    `}
                  >
                    {dayNum}
                  </button>
                )
              })}
            </div>

            {/* Footer: Quick Reset to Today */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleSelectToday}
                className="flex items-center gap-1 text-brand-primary hover:text-blue-800 font-bold hover:bg-brand-primary-light px-2 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw size={12} /> วันนี้
              </button>
              <span className="text-[11px] text-slate-400 font-mono">{currentIso}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}