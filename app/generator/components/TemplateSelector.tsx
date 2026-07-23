"use client"

import React from 'react'
import { TemplateId, TEMPLATES } from '@/app/lib/sentenceTemplates'

interface TemplateSelectorProps {
  activeTemplate: TemplateId
  setActiveTemplate: (tmplId: TemplateId) => void
}

export default function TemplateSelector({ activeTemplate, setActiveTemplate }: TemplateSelectorProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
        1. เลือกรูปแบบประโยครายงาน (Template)
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {TEMPLATES.map((tmpl) => {
          const isActive = activeTemplate === tmpl.id
          return (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => setActiveTemplate(tmpl.id)}
              className={`
                p-4 rounded-2xl text-left border transition-all flex flex-col justify-between gap-3 cursor-pointer
                ${isActive 
                  ? 'bg-brand-primary-light border-brand-primary text-blue-900 shadow-md ring-2 ring-brand-primary/20 font-bold' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              <span className={`text-[11px] px-2.5 py-1 rounded-lg font-bold w-fit ${isActive ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                {tmpl.badge}
              </span>
              <div>
                <div className="text-xs sm:text-sm font-bold leading-snug">{tmpl.name}</div>
                <div className="text-[11px] font-normal text-slate-500 mt-1 line-clamp-2">{tmpl.description}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
