import { Loader2 } from 'lucide-react'

export default function GlobalLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150 py-2">
      {/* Top Animated Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-blue-100 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 animate-pulse w-full" />
      </div>

      {/* Skeleton Banner Header */}
      <div className="bg-slate-900/90 rounded-3xl p-6 md:p-8 text-white shadow-xl flex items-center justify-between min-h-[110px] animate-pulse">
        <div className="space-y-2.5">
          <div className="h-3 w-32 bg-slate-800 rounded-full" />
          <div className="h-7 w-64 bg-slate-800 rounded-xl" />
          <div className="h-4 w-80 bg-slate-800/60 rounded-lg hidden sm:block" />
        </div>
        <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-blue-400">
          <Loader2 size={22} className="animate-spin" />
        </div>
      </div>

      {/* Skeleton Content Cards */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="h-5 w-48 bg-slate-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 bg-slate-50 border border-slate-100 rounded-2xl p-4 animate-pulse space-y-3">
              <div className="h-4 w-2/3 bg-slate-200 rounded-md" />
              <div className="h-3 w-1/2 bg-slate-200/70 rounded-md" />
              <div className="h-12 w-full bg-slate-200/40 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
