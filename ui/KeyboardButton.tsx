"use client"

import React, { useCallback, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { usePopper } from 'react-popper'

import Keyboard from './Keyboard'
import Portal from './Portal'

export default function KeyboardButton({ inputRef, language }: any) {
  let [popperElement, setPopperElement] = useState<any>()
  let { styles, attributes } = usePopper(inputRef.current, popperElement, {
    placement: 'bottom',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['top', 'right', 'left', 'bottom'],
        },
      },
      {
        name: 'preventOverflow',
        options: {
          rootBoundary: 'document'
        },
      }
    ],
  })

  const focusOnInput = useCallback(() => {
    inputRef.current?.focus()
  }, [inputRef])
  
  const preventFocus = (e: any) => {
    e.preventDefault()
  }

  const [showKeyboard, setShowKeyboard] = useState(false)
  const toggleShowKeyboard = () => {
    focusOnInput()
    setShowKeyboard(state => !state)
  }
  
  return (
    <Popover className="relative">
      <div className="contents">
        <Popover.Button className="contents group">
          <kbd onClick={toggleShowKeyboard} onMouseDown={preventFocus} className="h-full inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400 group-data-[headlessui-state=open]:border group-data-[headlessui-state=open]:border-blue-300">
            ⌘K
          </kbd>
        </Popover.Button>
        <Portal selector="#keyboard">
          <Transition
            show={showKeyboard}
            enter="transition ease-out duration-20"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-15"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
            >
            <div  className="relative w-full">
              <Popover.Panel static={true}
                {...attributes.popper}
                style={styles.popper}
                ref={setPopperElement}
                className="group absolute w-full px-4 sm:px-0 lg:max-w-xs">
                <div data-popper-arrow style={styles.arrow}
                className={`
                  absolute w-[12px] h-[12px] bg-gray-50 invisible
                  before:absolute before:w-[12px] before:h-[12px] before:bg-gray-50
                  before:visible before:content-[""] before:rotate-45
                  group-data-[popper-placement^=top]:bottom-[-6px]
                  group-data-[popper-placement^=bottom]:top-[-6px]
                  group-data-[popper-placement^=left]:right-[-6px]
                  group-data-[popper-placement^=right]:left-[-6px]
                `}
                ></div>
                <div className="bg-white overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <Keyboard inputRef={inputRef} language={language} />
                </div>
              </Popover.Panel>
            </div>
          </Transition>
        </Portal>
      </div>
    </Popover>
  )
}
