"use client"

import { useState, useRef, useEffect, SelectHTMLAttributes } from 'react'
import { ChevronDown, Check, Search, X } from 'lucide-react'

interface Option {
  value: string | number
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value' | 'defaultValue'> {
  label?: string
  name?: string
  value?: string | number
  defaultValue?: string | number
  onChange?: (e: { target: { name?: string; value: string } }) => void
  disabled?: boolean
  required?: boolean
  options: Option[]
  placeholder?: string
  className?: string
}

export function SelectField({
  label,
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  disabled = false,
  required = false,
  options = [],
  placeholder = 'เลือกข้อมูล',
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<string | number>(defaultValue ?? '')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Use controlled value if provided, else internal state
  const selectedValue = controlledValue !== undefined ? controlledValue : internalValue

  const selectedOption = options.find(opt => String(opt.value) === String(selectedValue))

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsTyping(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter options based on searchQuery
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  const handleSelect = (val: string | number) => {
    setInternalValue(val)
    setIsOpen(false)
    setIsTyping(false)
    setSearchQuery('')
    if (onChange) {
      onChange({ target: { name, value: String(val) } })
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setInternalValue('')
    setSearchQuery('')
    setIsTyping(false)
    if (onChange) {
      onChange({ target: { name, value: '' } })
    }
    if (inputRef.current) inputRef.current.focus()
  }

  const displayInputValue = isTyping
    ? searchQuery
    : (selectedOption ? selectedOption.label : '')

  return (
    <div className="w-full space-y-1.5" ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1.5">*</span>}
        </label>
      )}

      {/* Hidden input for standard HTML form submissions */}
      <input type="hidden" name={name} value={selectedValue ?? ''} required={required} />

      <div className="relative">
        {/* Searchable Input Trigger Box */}
        <div
          onClick={() => {
            if (!disabled) {
              setIsOpen(true)
              inputRef.current?.focus()
            }
          }}
          className={`
            w-full h-11 flex items-center justify-between
            bg-slate-50 border border-slate-200 text-slate-900 font-semibold
            px-4 py-2.5 rounded-2xl text-xs outline-none shadow-2xs 
            transition-all duration-200 ease-in-out 
            hover:border-slate-300 hover:bg-white 
            disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed 
            cursor-pointer ${isOpen ? 'bg-white border-brand-primary ring-4 ring-blue-600/10' : ''} ${className}
          `}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Search size={15} className={`shrink-0 ${isOpen ? 'text-brand-primary' : 'text-slate-400'}`} />
            <input
              ref={inputRef}
              type="text"
              disabled={disabled}
              placeholder={placeholder}
              value={displayInputValue}
              onFocus={() => {
                setIsOpen(true)
              }}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsTyping(true)
                if (!isOpen) setIsOpen(true)
              }}
              className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none cursor-text truncate"
            />
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {selectedValue !== '' && selectedValue !== undefined && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="ล้างข้อมูลที่เลือก"
              >
                <X size={14} />
              </button>
            )}
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-primary' : ''}`}
            />
          </div>
        </div>

        {/* Floating Searchable Options Menu */}
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
            {/* Options List */}
            <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="py-4 px-3 text-center text-xs text-slate-400 font-medium">
                  ไม่พบข้อมูลที่ตรงกับ &quot;{searchQuery}&quot;
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = String(opt.value) === String(selectedValue)
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`
                        w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all text-left cursor-pointer
                        ${isSelected
                          ? 'bg-brand-primary text-white font-bold shadow-xs'
                          : 'text-slate-700 font-semibold hover:bg-slate-100/80 hover:text-slate-900'
                        }
                      `}
                    >
                      <span className="truncate pr-2">{opt.label}</span>
                      {isSelected && <Check size={16} className="text-white shrink-0" />}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}