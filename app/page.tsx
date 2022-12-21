"use client"

import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <>
      <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
        {/* Start main area*/}
        <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
          <div className="h-full rounded-lg border-2 border-dashed border-gray-200 space-x-4 flex flex-row justify-start items-start" >
            <div className='relative inline-flex items-stretch py-1 px-4 text-xl font-semibold text-gray-600 border-2 rounded-sm border-b-8 border-b-green-300'>
              Salama
              <span className='inline-flex items-center'>
                <span className='relative ml-2 px-2 py-0.5 rounded-lg  right-0 leading-3 text-[0.7rem] bg-gray-900 text-white'>80%</span>
              </span>
            </div>
            <div className='relative inline-flex items-stretch py-1 px-4 text-xl font-semibold text-gray-600 border-2 rounded-sm border-b-8 border-b-blue-300'>
              Amini
              <span className='inline-flex items-center'>
                <span className='relative ml-2 px-2 py-0.5 rounded-lg  right-0 leading-3 text-[0.7rem] bg-gray-900 text-white'>70%</span>
              </span>
            </div>
            <div className='relative inline-flex items-stretch py-1 px-4 text-xl font-semibold text-gray-600 border-2 rounded-sm border-b-8 border-b-blue-300'>
              <img src='/api/images' className='h-[27px]' alt="word" />
              <span className='inline-flex items-center'>
                <span className='relative ml-2 px-2 py-0.5 rounded-lg  right-0 leading-3 text-[0.7rem] bg-gray-900 text-white'>70%</span>
              </span>
            </div>
          </div>
        </div>
        {/* End main area */}
      </main>
      <aside className="relative hidden w-96 flex-shrink-0 overflow-y-auto border-l border-gray-200 xl:flex xl:flex-col">
        {/* Start secondary column (hidden on smaller screens) */}
        <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
          <div className="h-full rounded-lg border-2 border-dashed border-gray-200" />
        </div>
        {/* End secondary column */}
      </aside>
    </>
  )
}
