"use client"

import { useState, useRef, useEffect, InputHTMLAttributes } from 'react'
import { Clock, Plus, Minus } from 'lucide-react'

interface TimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue'> {
  label?: string
  name?: string
  value?: string
  defaultValue?: string
  onChange?: (e: { target: { name?: string; value: string } }) => void
  disabled?: boolean
  required?: boolean
  className?: string
}

const QUICK_PRESETS = ['08:00', '08:30', '09:00', '09:30', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

export function TimePickerField({
  label,
  name,
  value: controlledValue,
  defaultValue = '09:00',
  onChange,
  disabled = false,
  required = false,
  className = ''
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<string>(defaultValue)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedValue = controlledValue !== undefined ? controlledValue : internalValue

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

  const handleValueChange = (val: string) => {
    if (controlledValue === undefined) {
      setInternalValue(val)
    }
    if (onChange) {
      onChange({ target: { name, value: val } })
    }
  }

  // Adjust time by minutes/hours with auto-rollover
  const adjustMinutes = (delta: number) => {
    const [hStr, mStr] = (selectedValue || '09:00').split(':')
    const h = parseInt(hStr || '9', 10)
    const m = parseInt(mStr || '0', 10)

    const totalMinutes = (h * 60 + m + delta) % 1440
    const normalized = (totalMinutes + 1440) % 1440
    const newH = String(Math.floor(normalized / 60)).padStart(2, '0')
    const newM = String(normalized % 60).padStart(2, '0')

    handleValueChange(`${newH}:${newM}`)
  }

  const adjustHours = (delta: number) => {
    const [hStr, mStr] = (selectedValue || '09:00').split(':')
    const h = parseInt(hStr || '9', 10)
    const m = mStr || '00'

    const newH = String(((h + delta) % 24 + 24) % 24).padStart(2, '0')
    handleValueChange(`${newH}:${m}`)
  }

  return (
    <div className={`space-y-1.5 w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative w-full">
        {/* Typeable Input + Clock Button Container */}
        <div
          className={`
            w-full h-11 flex items-center bg-slate-50 border rounded-2xl transition-all px-4 py-2.5
            ${disabled ? 'opacity-50 bg-slate-100 cursor-not-allowed' : ''}
            ${isOpen ? 'bg-white border-blue-600 ring-4 ring-blue-600/10 shadow-xs' : 'border-slate-200 hover:border-slate-300 hover:bg-white'}
          `}
        >
          {/* Direct Typeable Input */}
          <input
            type="text"
            name={name}
            value={selectedValue}
            disabled={disabled}
            required={required}
            onChange={(e) => handleValueChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="09:00"
            className="w-full bg-transparent text-xs font-bold font-mono text-slate-900 outline-none"
          />

          {/* Clock Popover Toggle Button */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer shrink-0 ml-1"
            title="เลือก/ปรับเวลา"
          >
            <Clock size={16} />
          </button>
        </div>

        {/* Minimal Time Popover */}
        {isOpen && !disabled && (
          <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 w-72 space-y-3 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Quick Adjust Steppers (+1m, -1m, +5m, +1h) */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                ปรับเวลาด่วน (Flexible Adjustment):
              </div>
              
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => adjustMinutes(1)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus size={13} /> 1 นาที
                </button>

                <button
                  type="button"
                  onClick={() => adjustMinutes(-1)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Minus size={13} /> 1 นาที
                </button>

                <button
                  type="button"
                  onClick={() => adjustMinutes(5)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  +5 นาที
                </button>

                <button
                  type="button"
                  onClick={() => adjustHours(1)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  +1 ชั่วโมง
                </button>
              </div>
            </div>

            {/* Quick Time Presets */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                เวลายอดนิยม:
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {QUICK_PRESETS.map((qt) => (
                  <button
                    key={qt}
                    type="button"
                    onClick={() => {
                      handleValueChange(qt)
                      setIsOpen(false)
                    }}
                    className={`
                      text-[11px] font-mono px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer
                      ${selectedValue === qt
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700'
                      }
                    `}
                  >
                    {qt}
                  </button>
                ))}
              </div>
            </div>

            {/* Done Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              ตกลง (Done)
            </button>

          </div>
        )}
      </div>
    </div>
  )
}
