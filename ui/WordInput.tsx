"use client"

import { useRef } from 'react'
import { Disclosure, Transition } from '@headlessui/react'

import Keyboard from './Keyboard'

export default function WordInput( {value, onChange }: any) {
  const ref = useRef<any>(null)
  const focusOnInput = () => {
    ref.current?.focus()
  }
  const onKeyClick = (key: string) => {
    let value = ref.current.value
    let pos = ref.current.selectionStart
    value = value.substr(0, ref.current.selectionStart) + key + value.substr(ref.current.selectionStart)

    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    nativeInputValueSetter?.call(ref.current, value);
    var ev2 = new Event('input', { bubbles: true});
    ref.current.dispatchEvent(ev2);

    ref.current.selectionEnd = ref.current.selectionStart = pos + key.length
    focusOnInput()
  }
  
  const preventFocus = (e: any) => {
    e.preventDefault()
  }

  return <div className="relative w-full mt-1">
    <Disclosure>
      <div className='relative'>
        <input
          ref={ref}
          onChange={onChange}
          value={value}
          type="text"
          placeholder="Rakibu"
          className={`font-amiri text-center text-3xl block text-md p-2 h-11 w-full rounded-md border-gray-300 pr-12 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder:text-lg`}
        />
        <Disclosure.Button onMouseDown={preventFocus} className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 group">
          <kbd onClick={focusOnInput} className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400 group-data-[headlessui-state=open]:border group-data-[headlessui-state=open]:border-blue-300">
            ⌘K
          </kbd>
        </Disclosure.Button>
      </div>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Disclosure.Panel className="mt-2">
          <Keyboard onKeyClick={onKeyClick} />
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  </div>
}
