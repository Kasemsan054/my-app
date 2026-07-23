"use client"

import React from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Contact, DeleteTarget } from '../../types'

interface ContactListProps {
  companyId: number
  contacts: Contact[]
  contactInputs: Record<number, { name: string; phone: string }>
  setContactInputs: React.Dispatch<React.SetStateAction<Record<number, { name: string; phone: string }>>>
  handleAddContact: (e: React.FormEvent, companyId: number) => void
  setEditContactTarget: (c: Contact) => void
  setEditContactNameInput: (v: string) => void
  setEditContactPhoneInput: (v: string) => void
  setDeleteTarget: (target: DeleteTarget) => void
}

export default function ContactList({
  companyId,
  contacts,
  contactInputs,
  setContactInputs,
  handleAddContact,
  setEditContactTarget,
  setEditContactNameInput,
  setEditContactPhoneInput,
  setDeleteTarget
}: ContactListProps) {
  return (
    <div className="space-y-2">
      {contacts.length === 0 ? (
        <div className="text-xs text-slate-400 italic py-1">ยังไม่มีผู้ติดต่อ</div>
      ) : (
        contacts.map(c => (
          <div key={c.id} className="flex justify-between items-center text-xs bg-white border border-slate-100 p-2.5 rounded-xl shadow-2xs">
            <span className="font-medium text-slate-800">
              {c.name} <span className="text-slate-400 font-normal">({c.phone})</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setEditContactTarget(c)
                  setEditContactNameInput(c.name)
                  setEditContactPhoneInput(c.phone)
                }}
                className="text-slate-400 hover:text-brand-primary hover:bg-brand-primary-light p-1 rounded-lg transition-colors cursor-pointer"
                title="แก้ไขผู้ติดต่อ"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => setDeleteTarget({ type: 'contact', id: c.id, name: `ผู้ติดต่อ ${c.name}` })}
                className="text-slate-300 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition-colors cursor-pointer"
                title="ลบผู้ติดต่อ"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))
      )}

      {/* Form: Add Contact under Company */}
      <form onSubmit={(e) => handleAddContact(e, companyId)} className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <input
          type="text"
          placeholder="ชื่อผู้ติดต่อ"
          value={contactInputs[companyId]?.name || ''}
          onChange={(e) => setContactInputs(prev => ({
            ...prev,
            [companyId]: { name: e.target.value, phone: prev[companyId]?.phone || '' }
          }))}
          required
          className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl outline-none focus:border-slate-900"
        />
        <div className="flex gap-1.5">
          <input
            type="text"
            placeholder="เบอร์โทร"
            value={contactInputs[companyId]?.phone || ''}
            onChange={(e) => setContactInputs(prev => ({
              ...prev,
              [companyId]: { name: prev[companyId]?.name || '', phone: e.target.value }
            }))}
            required
            className="flex-1 bg-white border border-slate-200 text-xs p-2.5 rounded-xl outline-none focus:border-slate-900"
          />
          <button type="submit" className="bg-brand-primary hover:bg-brand-primary-hover text-white px-3 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer">
            บันทึก
          </button>
        </div>
      </form>
    </div>
  )
}
