"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, Radio } from 'lucide-react'

interface RealtimeSyncBarProps {
  intervalMs?: number
  className?: string
}

export function RealtimeSyncBar({ intervalMs = 4000, className = "" }: RealtimeSyncBarProps) {
  const router = useRouter()
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("")

  const triggerSync = () => {
    setIsSyncing(true)
    router.refresh()
    setLastSyncedTime(new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    setTimeout(() => setIsSyncing(false), 600)
  }

  useEffect(() => {
    // eslint-disable-next-line
    setLastSyncedTime(new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))

    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setIsSyncing(true)
        router.refresh()
        setLastSyncedTime(new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        setTimeout(() => setIsSyncing(false), 600)
      }
    }, intervalMs)

    return () => clearInterval(timer)
  }, [router, intervalMs])

  return (
    <div className={`inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-2xl text-xs text-emerald-800 shadow-2xs font-semibold ${className}`}>
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>

      <span className="flex items-center gap-1">
        <Radio size={13} className="text-emerald-600" />
        <span>เรียลไทม์ Auto-Sync</span>
      </span>

      <span className="hidden sm:inline text-[11px] text-emerald-600 font-medium">
        ({lastSyncedTime ? `ล่าสุด ${lastSyncedTime}` : 'กำลังเชื่อมต่อ'})
      </span>

      <button
        type="button"
        onClick={triggerSync}
        className="ml-1 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100/80 p-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
        title="กดซิงค์ข้อมูลกับเซิร์ฟเวอร์ทันที"
      >
        <RefreshCw size={13} className={isSyncing ? "animate-spin text-emerald-600" : ""} />
        <span>ซิงค์ทันที</span>
      </button>
    </div>
  )
}

export default RealtimeSyncBar
