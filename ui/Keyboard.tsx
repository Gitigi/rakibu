"use client"

import { useState } from 'react';
import { Tab } from '@headlessui/react'

import classNames from "@/lib/classNames";

const tabs: any[] = [
  { name: 'Arabic', current: true },
  { name: 'Latin', current: false },
  { name: 'Greek', current: false },
]

export default function Keyboard({ onKeyClick }: any) {
  const [selectedIndex, setSelectedIndex] = useState<any>(0)

  const selectedTab = (e: any) => {
    setSelectedIndex(e.target.value)
  }

  const preventFocus = (e: any) => {
    var el: any = document.activeElement
    if( el?.tagName === 'INPUT') {
      setTimeout(()=>el?.focus())
    }
  }
  return <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex} as="div" className="border border-gray-600 rounded-lg">
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="bg-white text-gray-800 py-2 pl-4 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            defaultValue={tabs.find((tab) => tab.current).name}
            onChange={selectedTab}
          >
            {tabs.map((tab, index) => (
              <option key={tab.name} value={index}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
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
            <kbd onClick={onKeyClick.bind(null, key[0])} onMouseDown={preventFocus} data-key={ key[1] } key={index} className="font-amiri flex flex-col justify-center items-center rounded-md p-0.5 shadow-lg cursor-pointer data-[key=enter]:row-span-2 data-[key=space]:col-span-5">
              { key[0] === String.raw`\n` ? "\u2937" : key[0] === '\u200c' ? zeroWidthSvg : key[0]}
            </kbd>
          ))}
        </Tab.Panel>
        <Tab.Panel as="div" className="text-gray-800 bg-white grid grid-cols-12 gap-1 p-0.5 border border-gray-100 m-0.5 rounded-md">
          {latinAlt.map((key: any, index)=> (
            // <kbd key={index}>{ key[0] ==='\u200c' ? <Image height={30} width={30} src="/img/zwnj.jpg" alt="zero-width non-joiner"/> : key[0] }</kbd>
            <kbd onClick={onKeyClick.bind(null, key[0])} onMouseDown={preventFocus} data-key={ key[1] } key={index} className="flex flex-col justify-center items-center rounded-md p-0.5 shadow-lg cursor-pointer data-[key=enter]:row-span-2 data-[key=space]:col-span-5">
              { key[0] === String.raw`\n` ? "\u2937" : key[0]}
            </kbd>
          ))}
          {supNumber.map((key: any, index)=> (
            // <kbd key={index}>{ key[0] ==='\u200c' ? <Image height={30} width={30} src="/img/zwnj.jpg" alt="zero-width non-joiner"/> : key[0] }</kbd>
            <kbd onClick={onKeyClick.bind(null, key[0])} onMouseDown={preventFocus} data-key={ key[1] } key={index} className="flex flex-col justify-center items-center rounded-md p-0.5 shadow-lg cursor-pointer">
              { key[0] === String.raw`\n` ? "\u2937" : key[0]}
            </kbd>
          ))}
        </Tab.Panel>
        <Tab.Panel as="div" className="text-gray-800 bg-white grid grid-cols-12 gap-1 p-0.5 border border-gray-100 m-0.5 rounded-md">
          {greek.map((key: any, index)=> (
            // <kbd key={index}>{ key[0] ==='\u200c' ? <Image height={30} width={30} src="/img/zwnj.jpg" alt="zero-width non-joiner"/> : key[0] }</kbd>
            <kbd onClick={onKeyClick.bind(null, key[0])} onMouseDown={preventFocus} data-key={ key[1] } key={index} className="flex flex-col justify-center items-center rounded-md p-0.5 shadow-lg cursor-pointer">
              { key[0] === String.raw`\n` ? "\u2937" : key[0] === '\u200c' ? zeroWidthSvg : key[0]}
            </kbd>
          ))}
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
}
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
  ["ذ", ""],
  ["١", ""],
  ["٢", ""],
  ["٣", ""],
  ["٤", ""],
  ["٥", ""],
  ["٦", ""],
  ["٧", ""],
  ["٨", ""],
  ["٩", ""],
  ["٠", ""],
  ["\u279e", "backspace"],                                  // Row 1
  ["ض", ""],
  ["ص", ""],
  ["ث", ""],
  ["ق", ""],
  ["ف", ""],
  ["غ", ""],
  ["ع", ""],
  ["ه", ""],
  ["خ", ""],
  ["ح", ""],
  ["ج", ""],
  ["د", ""],                                                 //Row 2
  ["ش", ""],
  ["س", ""],
  ["ي", ""],
  ["ب", ""],
  ["ل", ""],
  ["ا", ""],
  ["ت", ""],
  ["ن", ""],
  ["م", ""],
  ["ك", ""],
  ["ط", ""],
  [String.raw`\n`, "enter"],                                // Row 3
  ["ئ", ""],
  ["ء", ""],
  ["ؤ", ""],
  ["ر", ""],
  ["لا", ""],
  ["ى", ""],
  ["ة", ""],
  ["و", ""],
  ["ز", ""],
  ["ظ", ""],
  ["ـ", "taṭwīl (kashīda)"],                                // Row 4
  ['آ', "alif madda"],
  ['أ', "alif with hamza on top"],
  ['إ', "alif with hamza below"],
  [" ", "space"],
  ['\u200c', "zero-width non-joiner (فاصلهٔ مجازی)"],
  ['؟', "Arabic question mark"],
  ['.', "full stop"],
  ["!", "exclamation mark"],                                // Row 5
];

var additionalKeys = [
  [circle+'\u0652',"sukūn"],
  [circle+'\u064b', "fatḥatān"],
  [circle+'\u064c',"ḍammatān"],
  [circle+'\u064d', "kasratān"],
  [circle+'\u064e', "fatḥa"],
  [circle+'\u064f', "ḍamma"],
  [circle+'\u0650',"kasra"],
  [circle+'\u0651', "shadda"],
  ['،', "Arabic comma"],
  ['ٱ', "alif waṣla"],
  [':', "colon"],
  ['؛', "Arabic semicolon"],                           // Row 6
];
var palaeoKeys = [
  [circle+'\u06e1',"Quranic sukūn"],
  [circle+'\u08f0',"Quranic open fatḥatān"],
  [circle+'\u08f1',"Quranic open ḍammatān"],
  [circle+'\u08f2',"Quranic open kasratān"],
  [circle+'\u0670',"dagger alif"],
  ['ٮ',"dotless b"],
  ['ں',"dotless n"],
  ['ڡ',"dotless f"],
  ['ٯ',"dotless q"],
  ['ڧ',"maghrebi q"],
  ['ڢ',"maghrebi f"],
  ['ٯ\u065c',"qāf with dot below"],                         // Row 7
];

var persianKeys = [
  ["۱", "Persian digit 1"],
  ["۲", "Persian digit 2"],
  ["۳", "Persian digit 3"],
  ["۴", "Persian digit 4"],
  ["۵", "Persian digit 5"],
  ["۶", "Persian digit 6"],
  ["۷", "Persian digit 7"],
  ["۸", "Persian digit 8"],
  ["۹", "Persian digit 9"],
  ["۰", "Persian digit 0"],
  ['پ', "Persian peh"],
  ['چ', "Persian cheh"],                                     //Row 8
  ['ژ', "Persian zheh"],
  ['ک', "Persian kāf"],
  ['گ', "Persian gāf"],
  ['ی', "Persian yeh"],
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
  ['{‎', "opening brace"],
  ['}‎', "closing brace"],
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
  ["ā", ""],
  ["ē", ""],
  ["ō", ""],
  ["ṯ", ""],
  ["ḥ", ""],
  ["ḵ", ""],
  ["ḏ", ""],
  ["š", ""],
  ["ṣ", ""],
  ["ḍ", ""],
  ["ṭ", ""],
  ["ẓ", ""],
  ["ž", ""],
  ["ḡ", ""],
  ["ū", ""],
  ["ī", ""],
  ["ʽ", ""],
  ["□", ""],
  ["○", ""]
]
const supNumber = [
  ["⁰", ""],
  ["¹", ""],
  ["²", ""],
  ["³", ""],
  ["⁴", ""],
  ["⁵", ""],
  ["⁶", ""],
  ["⁷", ""],
  ["⁸", ""],
  ["⁹", ""]
]

const greek = [
  ["α", ""],
  ["β", ""],
  ["γ", ""],
  ["δ", ""],
  ["ε", ""],
  ["ζ", ""],
  ["η", ""],
  ["θ", ""],
  ["ι", ""],
  ["κ", ""],
  ["λ", ""],
  ["μ", ""],
  ["ν", ""],
  ["ξ", ""],
  ["ο", ""],
  ["π", ""],
  ["ρ", ""],
  ["ς", ""],
  ["σ", ""],
  ["τ", ""],
  ["υ", ""],
  ["φ", ""],
  ["χ", ""],
  ["ψ", ""],
  ["ω", ""],
  ["Α", ""],
  ["Β", ""],
  ["Γ", ""],
  ["Δ", ""],
  ["Ε", ""],
  ["Ζ", ""],
  ["Η", ""],
  ["Θ", ""],
  ["Ι", ""],
  ["Κ", ""],
  ["Λ", ""],
  ["Μ", ""],
  ["Ν", ""],
  ["Ξ", ""],
  ["Ο", ""],
  ["Π", ""],
  ["Ρ", ""],
  ["Σ", ""],
  ["Τ", ""],
  ["Υ", ""],
  ["Φ", ""],
  ["Χ", ""],
  ["Ψ", ""],
  ["Ω", ""]
]
