"use client"

import React from 'react'
import { FileText } from 'lucide-react'
import { DOC_TYPES_OPTIONS } from '../types'

interface DocTypeSelectorProps {
  docTypes: string[]
  setDocTypes: React.Dispatch<React.SetStateAction<string[]>>
  otherDocType: string
  setOtherDocType: (v: string) => void
}

export default function DocTypeSelector({
  docTypes,
  setDocTypes,
  otherDocType,
  setOtherDocType
}: DocTypeSelectorProps) {
  const toggleDocType = (type: string) => {
    if (docTypes.includes(type)) {
      setDocTypes(docTypes.filter((t) => t !== type))
    } else {
      setDocTypes([...docTypes, type])
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
        <FileText size={16} className="text-brand-secondary" />
        วัตถุประสงค์ / ประเภทการดำเนินงาน (เลือกได้มากกว่า 1 ข้อ) *
      </label>
      <div className="flex flex-wrap gap-2">
        {DOC_TYPES_OPTIONS.map((type) => {
          const isSelected = docTypes.includes(type)
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleDocType(type)}
              className={`
                px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5
                ${isSelected
                  ? 'bg-brand-secondary text-white border-brand-secondary shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }
              `}
            >
              <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-300'}`} />
              {type}
            </button>
          )
        })}
      </div>

      {docTypes.includes('อื่นๆ') && (
        <input
          type="text"
          placeholder="ระบุวัตถุประสงค์อื่นๆ..."
          value={otherDocType}
          onChange={(e) => setOtherDocType(e.target.value)}
          className="w-full bg-white border border-slate-200 py-2.5 px-4 rounded-2xl text-xs font-medium outline-none focus:border-brand-secondary focus:ring-4 focus:ring-indigo-600/5 mt-2"
        />
      )}
    </div>
  )
}
