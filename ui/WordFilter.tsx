"use client"

import { useState, useRef, Fragment } from 'react'
import { BarsArrowUpIcon, BarsArrowDownIcon, DocumentTextIcon, PhotoIcon, CheckBadgeIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Virtuoso } from 'react-virtuoso'

import { PillToggle, ButtonToggle} from './ListChoice'
import { useEffect } from 'react'
import classNames from '@/lib/classNames'
import { useRakibu } from './RakibuContext'

function SelectPage({ pages, value, onChange, className }: any) {
  const [selected, setSelected] = useState(value || '')
  const [query, setQuery] = useState('')
  const selectedIndex = useRef(0)
  const ref = useRef<any>(null)

  useEffect(()=>{
    let index = pages.indexOf(selected)
    selectedIndex.current = index > -1 ? index : 0
  }, [selected, pages])

  useEffect(()=>{
    setSelected(value)
  }, [value])

  const scrollToView = () => {
    setTimeout(()=>ref.current?.scrollIntoView({
      index: selectedIndex.current,
      behavior: 'auto',
    }), 1)
  }

  const pageSelected = ( page: string ) => {
    setSelected(page);
    onChange(page)
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
    <div className={classNames("w-72", className || '')}>
      <Combobox value={selected} onChange={pageSelected} nullable>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              placeholder='Select Page'
              className="w-full border-none py-3 pl-3 pr-10 text-sm leading-5 bg-white text-gray-800 focus:ring-0"
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
            <Combobox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-hidden rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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

function Range({ value, onChange }: any) {
  const [ sliderValue, setValue ] = useState<number>(value)
  const timeout = useRef<any>(null)

  const onSlide = (e: any) => {
    let v = Number(e.target.value)
    setValue(()=>{
      clearTimeout(timeout.current)
      timeout.current = setTimeout(()=>{
        onChange(v);
      }, 500)
      return v
    })
  }

  return <div className="relative pt-2 pb-1 px-2 border rounded-xl">
    <label className='absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900'>Accuracy { value }</label>
    <input
      value={sliderValue}
      type="range"
      className="
        w-full
        h-6
        p-0
        focus:outline-none focus:ring-0 focus:shadow-none
      "
      onChange={onSlide}
    />
  </div>
}

function SearchInput({ onChange, value, usage, ...props }: any) {
  const [searchValue, setValue] = useState(value || '')
  const [mode, setMode] = useState<any>({modeSensitive: false, modeWord: false, modeRegex: false})
  const timeout = useRef<any>(null)

  useEffect(()=>{
    setValue(value)
  }, [value])

  const textChanged = (e: any) => {
    let v = e.target.value
    setValue(()=>{
      clearTimeout(timeout.current)
      timeout.current = setTimeout(()=>{
        try{
          // validate regex before calling onChange
          if(mode['modeRegex']) new RegExp(v)
          onChange('search', v)
        } catch(e) {}
      }, 500)
      return v
    })
  }

  const toggleMode = (md: string) => {
    setMode((mode: any) => {
      mode = {...mode, [md]: !mode[md]}
      setTimeout(()=>{
        onChange(md, mode[md])
      })
      return mode
    })
  }

  return <div className='relative'>
    <input type='text' {...props} value={searchValue} onChange={textChanged} />
    {usage === 'words' ? <div className='absolute inset-y-0 right-0 flex py-1.5 pr-1.5 gap-1'>
      <span onClick={toggleMode.bind(null, 'modeSensitive')} className={classNames(
        'p-1 border  rounded-lg text-gray-600 text-lg flex items-center w-8 h-8 justify-center cursor-pointer',
        mode.modeSensitive ? 'border-blue-300 text-blue-600' : 'border-gray-300 text-gray-600'
        )}
      >Cc</span>
      <span onClick={toggleMode.bind(null, 'modeWord')} className={classNames(
        'p-1 border  rounded-lg text-gray-600 text-lg flex items-center w-8 h-8 justify-center cursor-pointer',
        mode.modeWord ? 'border-blue-300 text-blue-600' : 'border-gray-300 text-gray-600'
        )}
      >W</span>
      <span onClick={toggleMode.bind(null, 'modeRegex')} className={classNames(
        'p-1 border  rounded-lg text-gray-600 text-lg flex items-center w-8 h-8 justify-center cursor-pointer',
        mode.modeRegex ? 'border-blue-300 text-blue-600' : 'border-gray-300 text-gray-600'
        )}
      >.*</span>
    </div> : null}
  </div>
}

export type FilterQuery = {
  search: string,
  order: string,
  rakibu: boolean | null | undefined
  page: string,
  language: string[] | null | undefined
  accuracy: number,
  modeSensitive: boolean,
  modeWord: boolean,
  modeRegex: boolean
}

export default function WordFilter({ pages, filter, setFilter, usage }: any) {

  let [wordDisplay, setWordDisplay] = useRakibu((v)=>v['wordDisplay'])
  wordDisplay = Object.entries(wordDisplay).filter(v => v[1]).map(v => v[0])

  const onDisplayChange = (e: string[]) => {
    setWordDisplay({'wordDisplay': Object.fromEntries(e.map(v => [v, true]))})
  }

  const updateFilter = (field: string, value: any) => {
    setFilter((state: FilterQuery) => ({...state, [field]: value}))
  }
  return <>
    <div className='flex flex-wrap gap-4 items-center w-full'>
      <div className='flex-shrink-0 w-full md:flex-1 md:w-auto'>
        <SearchInput value={filter.search} usage={usage} onChange={updateFilter} className='bg-white text-gray-800 p-2 border rounded-lg border-gray-400 w-full focus-within:outline-none focus:outline-none' placeholder='Search' type='text' />
      </div>
      <PillToggle keys={['asc', 'desc']} value={filter.order} onChange={updateFilter.bind(null, 'order')} maxSelect={1}>
        <BarsArrowUpIcon className='h-6 w-6 text-gray-400' />
        <BarsArrowDownIcon className='h-6 w-6 text-gray-400' />
      </PillToggle>
      <PillToggle keys={[false, true]} maxSelect={1} value={filter.rakibu} onChange={updateFilter.bind(null, 'rakibu')}>
        <QuestionMarkCircleIcon className='h-6 w-6 text-gray-400' />
        <CheckBadgeIcon className='h-6 w-6 text-gray-400' />
      </PillToggle>
      <PillToggle keys={['text', 'image']} value={wordDisplay} onChange={onDisplayChange}>
        <DocumentTextIcon className='h-6 w-6 text-gray-400' />
        <PhotoIcon className='h-6 w-6 text-gray-400' />
      </PillToggle>
    </div>
    <div className='flex flex-wrap gap-2 items-center mt-3'>
      <SelectPage className="bg-white text-gray-800 flex-1" pages={pages} value={filter.page} onChange={updateFilter.bind(null, 'page')} />
      <ButtonToggle keys={['en', 'ar']} value={filter.language} onChange={updateFilter.bind(null, 'language')} className="flex-shrink-0 flex flex-row h-12 w-32 items-stretch gap-4 p-1">
        <span>EN</span>
        <span>AR</span>
      </ButtonToggle>
      <div className='flex-shrink-0 w-full mt-3 md:flex-1 md:w-auto md:mt-auto'>
        <Range value={filter.accuracy} onChange={updateFilter.bind(null, 'accuracy')} />
      </div>
    </div>
  </>
}