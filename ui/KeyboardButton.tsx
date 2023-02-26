"use client"

import React, { useCallback, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { usePopper } from 'react-popper'

import Keyboard from './Keyboard'
import Portal from './Portal'

export default function KeyboardButton({ word, parentRef }: any) {
  let [popperElement, setPopperElement] = useState<any>()
  let { styles, attributes } = usePopper(parentRef.current, popperElement, {
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
    parentRef.current?.focus()
  }, [parentRef])

  const onKeyClick = useCallback((key: string) => {
    let value = parentRef.current.value
    let pos = parentRef.current.selectionStart
    value = value.substr(0, parentRef.current.selectionStart) + key + value.substr(parentRef.current.selectionStart)

    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    nativeInputValueSetter?.call(parentRef.current, value);
    var ev2 = new Event('input', { bubbles: true});
    parentRef.current.dispatchEvent(ev2);

    parentRef.current.selectionEnd = parentRef.current.selectionStart = pos + key.length
    focusOnInput()
  }, [parentRef, focusOnInput])

  const [showKeyboard, setShowKeyboard] = useState(false)
  const toggleShowKeyboard = () => {
    focusOnInput()
    setShowKeyboard(state => !state)
  }
  
  return (
    <Popover className="relative">
      <div className="contents">
        <Popover.Button className="contents group">
          <kbd onClick={toggleShowKeyboard} className="h-full inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400 group-data-[headlessui-state=open]:border group-data-[headlessui-state=open]:border-blue-300">
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
                  <Keyboard onKeyClick={onKeyClick} />
                </div>
              </Popover.Panel>
            </div>
          </Transition>
        </Portal>
      </div>
    </Popover>
  )
}
