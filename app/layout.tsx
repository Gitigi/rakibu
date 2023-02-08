"use client"

import './globals.css'

import { Fragment, useState, useRef } from 'react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation';

import { Dialog, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  PencilSquareIcon,
  HomeIcon,
  MagnifyingGlassCircleIcon,
  MapIcon,
  MegaphoneIcon,
  XMarkIcon,
  Bars3CenterLeftIcon,
  QueueListIcon
} from '@heroicons/react/24/outline'

import localFont from '@next/font/local'

import RakibuContext from '@/ui/RakibuContext';

const amiri = localFont({
  src: '../fonts/Amiri/Amiri-Regular.ttf',
  weight: "400",
  variable: '--font-amiri'
})

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, current: true },
  { name: 'Lines', href: '/lines', icon: Bars3CenterLeftIcon, current: false },
  { name: 'Words', href: '/words', icon: QueueListIcon, current: false },
  { name: 'Directory', href: '#', icon: MagnifyingGlassCircleIcon, current: false },
  { name: 'Announcements', href: '#', icon: MegaphoneIcon, current: false },
  { name: 'Office Map', href: '#', icon: MapIcon, current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = useSelectedLayoutSegment() || ''
  const rakibuContextValue = useRef<any>({})

  return (
    <html lang="en" className='h-full bg-gray-50'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={`h-full overflow-hidden ${amiri.variable}`}>
        <RakibuContext.Provider value={rakibuContextValue} >
          <div className="flex h-full">
            <Transition.Root show={sidebarOpen} as={Fragment}>
              <Dialog as="div" className="relative z-40 xl:hidden" onClose={setSidebarOpen}>
                <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 z-40 flex">
                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                  >
                    <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white focus:outline-none">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                          <button
                            type="button"
                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <span className="sr-only">Close sidebar</span>
                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                          </button>
                        </div>
                      </Transition.Child>
                      <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                        <div className="flex flex-shrink-0 items-center px-4">
                          <img
                            className="h-8 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Your Company"
                          />
                        </div>
                        <nav aria-label="Sidebar" className="mt-5">
                          <div className="space-y-1 px-2">
                            {navigation.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                  item.href === `/${pathname}`
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                  'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                )}
                              >
                                <item.icon
                                  className={classNames(
                                    item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                                    'mr-4 h-6 w-6'
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </nav>
                      </div>
                      <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                        <a href="#" className="group block flex-shrink-0">
                          <div className="flex items-center">
                            <div>
                              <img
                                className="inline-block h-10 w-10 rounded-full"
                                src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
                                alt=""
                              />
                            </div>
                            <div className="ml-3">
                              <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                                Whitney Francis
                              </p>
                              <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">View profile</p>
                            </div>
                          </div>
                        </a>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                  <div className="w-14 flex-shrink-0" aria-hidden="true">
                    {/* Force sidebar to shrink to fit close icon */}
                  </div>
                </div>
              </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="hidden xl:flex xl:flex-shrink-0">
              <div className="flex w-64 flex-col">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-gray-800">
                  <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                    <div className="flex flex-shrink-0 items-center px-4">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="mt-5 flex-1" aria-label="Sidebar">
                      <div className="space-y-1 px-2">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.href === `/${pathname}`
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                                'mr-3 h-6 w-6'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </nav>
                  </div>
                  <div className="flex flex-shrink-0 bg-gray-700 p-4">
                    <a href="#" className="group block w-full flex-shrink-0">
                      <div className="flex items-center">
                        <div>
                          <img
                            className="inline-block h-9 w-9 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-white">Tom Cook</p>
                          <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">View profile</p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <div className="xl:hidden">
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-2 py-1.5">
                  <div className="flex gap-2 items-center">
                    <button
                      type="button"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
                      onClick={() => setSidebarOpen(true)}
                    >
                      <span className="sr-only">Open sidebar</span>
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                      alt="Your Company"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
                      onClick={() => rakibuContextValue.current.setOpen(true)}
                    >
                      <span className="sr-only">Open sidebar</span>
                      <PencilSquareIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative z-0 flex flex-1 overflow-hidden">
                {children}
              </div>
            </div>
          </div>
        </RakibuContext.Provider>
      </body>
    </html>
  )
}
