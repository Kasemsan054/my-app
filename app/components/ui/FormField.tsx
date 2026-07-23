import { TextareaHTMLAttributes, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function InputField({ label, className = '', ...props }: InputProps) {
  return (
    <div className="w-full space-y-1.5">
      <label className="block text-xs font-bold text-slate-700">
        {label}
        {props.required && <span className="text-red-500 ml-1.5">*</span>}
      </label>
      <input 
        className={`
          w-full h-11 bg-slate-50 border border-slate-200 text-slate-900 font-semibold 
          px-4 py-2.5 rounded-2xl text-xs outline-none shadow-2xs 
          transition-all duration-200 ease-in-out 
          hover:border-slate-300 hover:bg-white 
          focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-blue-600/10 
          disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed 
          ${className}
        `}
        {...props} 
      />
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function TextareaField({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full space-y-1.5">
      <label className="block text-xs font-bold text-slate-700">
        {label}
        {props.required && <span className="text-red-500 ml-1.5">*</span>}
      </label>
      <textarea 
        className={`
          w-full bg-slate-50 border border-slate-200 text-slate-900 font-semibold 
          p-3 rounded-2xl text-xs outline-none shadow-2xs 
          transition-all duration-200 ease-in-out 
          hover:border-slate-300 hover:bg-white 
          focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-blue-600/10 
          disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed 
          ${className}
        `}
        {...props} 
      />
    </div>
  )
}