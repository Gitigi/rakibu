"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { Tab } from '@headlessui/react'

import classNames from "@/lib/classNames";

const tabs: any[] = [
  { name: 'Arabic', current: true },
  { name: 'Latin', current: false },
  { name: 'Greek', current: false },
]

function KeyboardComponent({ inputRef, language }: any) {
  const [selectedIndex, setSelectedIndex] = useState<any>(0)

  useEffect(()=>{
    let langKeys: {[key: string]: number} = {
      'ar': 0,
      'en': 1
    }
    setSelectedIndex(langKeys[language] || 0)
  }, [language])

  const focusOnInput = useCallback(() => {
    inputRef.current?.focus()
  }, [inputRef])

  const onKeyClick = useCallback((e: any) => {
    const key = e.target.getAttribute('data-value')
    let value = inputRef.current.value
    let pos = inputRef.current.selectionStart
    value = value.substr(0, inputRef.current.selectionStart) + key + value.substr(inputRef.current.selectionStart)

    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    nativeInputValueSetter?.call(inputRef.current, value);
    var ev2 = new Event('input', { bubbles: true});
    inputRef.current.dispatchEvent(ev2);

    inputRef.current.selectionEnd = inputRef.current.selectionStart = pos + key.length
    focusOnInput()
  }, [inputRef, focusOnInput])

  const preventFocus = (e: any) => {
    var el: any = document.activeElement
    if( el?.tagName === 'INPUT') {
      setTimeout(()=>el?.focus())
    }
  }
  return <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex} as="div" className="border border-gray-300 rounded-lg shadow-lg">
      <div className="bg-white">
        <div className="">
          <div className="border-b border-gray-200">
            <Tab.List as="nav" className="-mb-px flex" aria-label="Tabs">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  onMouseUp={preventFocus}
                  className={classNames(
                    'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none',
                    'data-[headlessui-state=selected]:border-indigo-500 data-[headlessui-state=selected]:text-indigo-600',
                    'w-1/4 py-2 px-1 text-center border-b-2 font-medium text-sm'
                  )}
                  aria-current={tab.current ? 'page' : undefined}
                >
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>
          </div>
        </div>
      </div>

      <Tab.Panels className="min-h-[160px]">
        <Tab.Panel as="div" className="text-gray-800 bg-white grid grid-cols-12 gap-1 p-0.5 border border-gray-100 m-0.5 rounded-md">
          {basicKeys.map((key: any, index)=> (
            // <kbd key={index}>{ key[0] ==='\u200c' ? <Image height={30} width={30} src="/img/zwnj.jpg" alt="zero-width non-joiner"/> : key[0] }</kbd>
            <kbd onClick={onKeyClick} onMouseDown={preventFocus} data-value={ key[0] } data-key={ key[1] } key={index} className="font-amiri flex flex-col justify-center items-center rounded-md p-0.5 shadow-lg cursor-pointer data-[key=enter]:row-span-2 data-[key=space]:col-span-5">
              { key[0] === String.raw`\n` ? "\u2937" : key[0] === '\u200c' ? zeroWidthSvg : key[0]}
            </kbd>
          ))}
        </Tab.Panel>
        <Tab.Panel as="div" className="text-gray-800 bg-white grid grid-cols-12 gap-1 p-0.5 border border-gray-100 m-0.5 rounded-md">
          {latinAlt.map((key: any, index)=> (
            // <kbd key={index}>{ key[0] ==='\u200c' ? <Image height={30} width={30} src="/img/zwnj.jpg" alt="zero-width non-joiner"/> : key[0] }</kbd>
            <kbd onClick={onKeyClick} onMouseDown={preventFocus} data-value={ key[0] } data-key={ key[1] } key={index} className="flex flex-col justify-center items-center rounded-md p-0.5 shadow-lg cursor-pointer data-[key=enter]:row-span-2 data-[key=space]:col-span-5">
              { key[0] === String.raw`\n` ? "\u2937" : key[0]}
            </kbd>
          ))}
          {supNumber.map((key: any, index)=> (
            // <kbd key={index}>{ key[0] ==='\u200c' ? <Image height={30} width={30} src="/img/zwnj.jpg" alt="zero-width non-joiner"/> : key[0] }</kbd>
            <kbd onClick={onKeyClick} onMouseDown={preventFocus} data-value={ key[0] } data-key={ key[1] } key={index} className="flex flex-col justify-center items-center rounded-md p-0.5 shadow-lg cursor-pointer">
              { key[0] === String.raw`\n` ? "\u2937" : key[0]}
            </kbd>
          ))}
        </Tab.Panel>
        <Tab.Panel as="div" className="text-gray-800 bg-white grid grid-cols-12 gap-1 p-0.5 border border-gray-100 m-0.5 rounded-md">
          {greek.map((key: any, index)=> (
            // <kbd key={index}>{ key[0] ==='\u200c' ? <Image height={30} width={30} src="/img/zwnj.jpg" alt="zero-width non-joiner"/> : key[0] }</kbd>
            <kbd onClick={onKeyClick} onMouseDown={preventFocus} data-value={ key[0] } data-key={ key[1] } key={index} className="flex flex-col justify-center items-center rounded-md p-0.5 shadow-lg cursor-pointer">
              { key[0] === String.raw`\n` ? "\u2937" : key[0] === '\u200c' ? zeroWidthSvg : key[0]}
            </kbd>
          ))}
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
}
const Keyboard = React.memo(KeyboardComponent)
export default Keyboard

const circle = "\u25cc"; // dotted circle for diacritics

const zeroWidthSvg = <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 30.000000 30.000000" preserveAspectRatio="xMidYMid meet">
  <g transform="translate(0.000000,30.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
    <path d="M108 248 l32 -33 32 33 33 32 -65 0 -65 0 33 -32z" />
    <path d="M130 190 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
    <path d="M130 150 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
    <path d="M130 110 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
    <path d="M130 70 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
    <path d="M130 30 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
  </g>
</svg>
var basicKeys = [
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["\u279e", "backspace"],                                  // Row 1
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],                                                 //Row 2
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  [String.raw`\n`, "enter"],                                // Row 3
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["????", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", "ta???w??l (kash??da)"],                                // Row 4
  ['??', "alif madda"],
  ['??', "alif with hamza on top"],
  ['??', "alif with hamza below"],
  [" ", "space"],
  ['\u200c', "zero-width non-joiner (???????????? ??????????)"],
  ['??', "Arabic question mark"],
  ['.', "full stop"],
  ["!", "exclamation mark"],                                // Row 5
];

var additionalKeys = [
  [circle+'\u0652',"suk??n"],
  [circle+'\u064b', "fat???at??n"],
  [circle+'\u064c',"???ammat??n"],
  [circle+'\u064d', "kasrat??n"],
  [circle+'\u064e', "fat???a"],
  [circle+'\u064f', "???amma"],
  [circle+'\u0650',"kasra"],
  [circle+'\u0651', "shadda"],
  ['??', "Arabic comma"],
  ['??', "alif wa???la"],
  [':', "colon"],
  ['??', "Arabic semicolon"],                           // Row 6
];
var palaeoKeys = [
  [circle+'\u06e1',"Quranic suk??n"],
  [circle+'\u08f0',"Quranic open fat???at??n"],
  [circle+'\u08f1',"Quranic open ???ammat??n"],
  [circle+'\u08f2',"Quranic open kasrat??n"],
  [circle+'\u0670',"dagger alif"],
  ['??',"dotless b"],
  ['??',"dotless n"],
  ['??',"dotless f"],
  ['??',"dotless q"],
  ['??',"maghrebi q"],
  ['??',"maghrebi f"],
  ['??\u065c',"q??f with dot below"],                         // Row 7
];

var persianKeys = [
  ["??", "Persian digit 1"],
  ["??", "Persian digit 2"],
  ["??", "Persian digit 3"],
  ["??", "Persian digit 4"],
  ["??", "Persian digit 5"],
  ["??", "Persian digit 6"],
  ["??", "Persian digit 7"],
  ["??", "Persian digit 8"],
  ["??", "Persian digit 9"],
  ["??", "Persian digit 0"],
  ['??', "Persian peh"],
  ['??', "Persian cheh"],                                     //Row 8
  ['??', "Persian zheh"],
  ['??', "Persian k??f"],
  ['??', "Persian g??f"],
  ['??', "Persian yeh"],
  ['\u06c2', "Persian heh-yeh"],
];
var regexKeys = [
  ['.', "dot"],
  [',', "latin comma"],
  ['?', "latin question mark"],
  ['-', "hyphen"],
  ['+', "plus"],
  ['*', "asterisk"],
  ['|', "vertical bar (pipe)"],                             // Row 9
  ['/', "forward slash"],
  [String.raw`\\`, "backslash"],
  ['(', "opening bracket"],
  [')', "closing bracket"],
  ['[', "opening square bracket"],
  [']', "closing square bracket"],
  ['{???', "opening brace"],
  ['}???', "closing brace"],
  ['<', "opening angular bracket"],
  ['>', "closing angular bracket"],
  ['^', "caret / circonflex"],
  ['$', "dollar sign"],
  ['@', "ampersand"],
  ['%', "percent / modulo"],
  ['"', "double quote"],
  ["'", "single quote"],
  ["_", "underscore"],
  ["=", "equals"],
];

const latinAlt = [
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["???", ""],
  ["???", ""],
  ["???", ""],
  ["???", ""],
  ["??", ""],
  ["???", ""],
  ["???", ""],
  ["???", ""],
  ["???", ""],
  ["??", ""],
  ["???", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["???", ""],
  ["???", ""],
  ["??", ""],
  ["??", ""],
  ["???", ""]
]
const supNumber = [
  ["???", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["???", ""],
  ["???", ""],
  ["???", ""],
  ["???", ""],
  ["???", ""],
  ["???", ""]
]

const greek = [
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""],
  ["??", ""]
]
