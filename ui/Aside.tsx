"use client"

import { Fragment, useContext, useEffect, useState, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

import RakibuContext from './RakibuContext'

const LARGE_SCREEN = 1024

export default function Aside({ children }: any) {
  const [open, setOpen] = useState(false)
  const [hasSidebar, setHasSidebar] = useState(false)
  const rakibuContext = useContext(RakibuContext)

  rakibuContext.current['setOpen'] = setOpen;

  useEffect(()=>{
    window.addEventListener("resize", function(event) {
      setHasSidebar(document.body.clientWidth < LARGE_SCREEN)
    })
    setHasSidebar(window.document.body.clientWidth < LARGE_SCREEN)
  }, [])

  return <>
    <aside className="relative hidden w-96 flex-shrink-0 overflow-y-auto border-l border-gray-200 lg:flex lg:flex-col">
      {/* Start secondary column (hidden on smaller screens) */}
      <div className="absolute inset-0 py-3 px-4 xl:px-8">
        <div className="h-full rounded-lg border-2 border-solid border-gray-200 overflow-y-hidden">
          {!hasSidebar && children}
        </div>
      </div>
      {/* End secondary column */}
    </aside>
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10 lg:hidden" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-opacity-75 transition-opacity backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {/* Replace with your content */}
                      <div className="absolute inset-0 px-4 sm:px-6">
                      {hasSidebar && children}
                      </div>
                      {/* /End replace */}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  </>
}
