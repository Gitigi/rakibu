"use client"

import { useState, useRef, Fragment } from 'react'
import { BarsArrowUpIcon, BarsArrowDownIcon, DocumentTextIcon, PhotoIcon, CheckBadgeIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Virtuoso } from 'react-virtuoso'

import { PillToggle, ButtonToggle} from './ListChoice'
import { useEffect } from 'react'

function SelectPage({ pages }: any) {
  const [selected, setSelected] = useState('')
  const [query, setQuery] = useState('')
  const selectedIndex = useRef(0)
  const ref = useRef<any>(null)

  useEffect(()=>{
    let index = pages.indexOf(selected)
    selectedIndex.current = index > -1 ? index : 0
  }, [selected, pages])

  const scrollToView = () => {
    setTimeout(()=>ref.current?.scrollIntoView({
      index: selectedIndex.current,
      behavior: 'auto',
    }), 1)
  }

  const filteredPages =
    query === ''
      ? pages
      : pages.filter((page: string) =>
          page.toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )
  return (
    <div className="w-72">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              placeholder='Select Page'
              className="w-full border-none py-3 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(page: string) => page}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
            afterEnter={scrollToView}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-hidden rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredPages.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                <Virtuoso
                  ref={ref}
                  style={{ height: '240px' }}
                  data={filteredPages}
                  fixedItemHeight={36}
                  itemContent={(index, page) => <Combobox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={page}
                  >
                    {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {page}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-teal-600'
                              }`}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                  </Combobox.Option>}
                />
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}

function Range() {
  const [ value, setValue ] = useState<number>(100)
  const timeout = useRef<any>(null)

  const onChange = (e: any) => {
    setValue(Number(e.target.value))
  }
  useEffect(()=>{
    clearTimeout(timeout.current)
    timeout.current = setTimeout(()=>{
      console.log(value)
    }, 500)

    return () => clearTimeout(timeout.current)
  }, [value])
  return <div className="relative pt-2 pb-1 px-2 border rounded-xl">
    <label className='absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900'>Accuracy { value }</label>
    <input
      value={value}
      type="range"
      className="
        w-full
        h-6
        p-0
        focus:outline-none focus:ring-0 focus:shadow-none
      "
      onChange={onChange}
    />
  </div>
}

export default function WordFilter({ pages }: any) {
  return <>
    <div className='flex gap-4 items-center'>
      <div className='flex-1'>
        <input className='p-2 border-2 rounded-lg border-gray-400 w-full focus-within:outline-none focus:outline-none' placeholder='Search' type='text' />
      </div>
      <PillToggle keys={['asc', 'desc']} maxSelect={1}>
        <BarsArrowUpIcon className='h-6 w-6 text-gray-400' />
        <BarsArrowDownIcon className='h-6 w-6 text-gray-400' />
      </PillToggle>
      <PillToggle keys={['text', 'image']}>
        <DocumentTextIcon className='h-6 w-6 text-gray-400' />
        <PhotoIcon className='h-6 w-6 text-gray-400' />
      </PillToggle>
      <PillToggle keys={[false, true]}>
        <QuestionMarkCircleIcon className='h-6 w-6 text-gray-400' />
        <CheckBadgeIcon className='h-6 w-6 text-gray-400' />
      </PillToggle>
    </div>
    <div className='flex gap-2 items-center mt-3'>
      <SelectPage pages={pages} />
      <ButtonToggle onChoice={(v: any)=>console.log('selected ', v)} maxSelect={1} minSelect={0} keys={[true, false]} value={[true]} className="flex-shrink-0 flex flex-row h-12 w-32 items-stretch gap-4 p-1">
        <span>EN</span>
        <span>AR</span>
      </ButtonToggle>

      <div className='flex-1'>
        <Range />
      </div>


    </div>
  </>
}