"use client"

import { useRef } from 'react'

import KeyboardButton from './KeyboardButton'

export default function WordInput( {value, onChange, language }: any) {
  const ref = useRef<any>(null)

  return <div className="relative w-full mt-1">
    <div className='relative overflow-x-visible'>
      <input
        ref={ref}
        onChange={onChange}
        value={value}
        type="text"
        placeholder="Rakibu"
        className={`bg-white text-gray-800 font-amiri text-center text-xl block text-md p-2 h-11 w-full rounded-md border-gray-300 pr-12 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder:text-lg`}
      />
      <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 group">
        <KeyboardButton inputRef={ref} language={language} />
      </div>
    </div>
  </div>
}
