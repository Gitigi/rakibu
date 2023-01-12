"use client"
import { useRef, useCallback, useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import { Virtuoso } from 'react-virtuoso'

import Image from 'next/image'
import { ArrowLongLeftIcon, ArrowLongRightIcon, BarsArrowUpIcon, BarsArrowDownIcon, DocumentTextIcon, PhotoIcon, CheckBadgeIcon, QuestionMarkCircleIcon} from '@heroicons/react/20/solid'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const people = [
  { id: 1, name: 'Wade Cooper' },
  { id: 2, name: 'Arlene Mccoy' },
  { id: 3, name: 'Devon Webb' },
  { id: 4, name: 'Tom Cook' },
  { id: 5, name: 'Tanya Fox' },
  { id: 6, name: 'Hellen Schmidt' },
]

function SelectPage() {
  const [selected, setSelected] = useState(people[0])
  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person) =>
          person.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )
  return (
    <div className="w-72">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-3 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(person: any) => person.name}
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
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredPeople.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredPeople.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {person.name}
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
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}

function Word({ word }: any) {
  const height = word.bbox[1][1] - word.bbox[0][1]
  const width = word.bbox[1][0] - word.bbox[0][0]

  return <Link href={`/lines/word/${word.id}`} data-lang={word.lang} className='relative flex-shrink-0 inline-flex items-stretch py-1 px-4 text-xl font-semibold text-gray-600 border-2 rounded-sm border-b-8 data-[lang=en]:border-b-green-300 data-[lang=ar]:border-b-blue-300'>
    {/* <Image height={height} width={width} src={`/api/images/${word.page}/${word.section}/${word.line_index}/${word.index}`} className='max-h-[27px] w-auto' alt="word" /> */}
    {word.text}
    <span className='inline-flex items-center'>
      <span className='ml-2 px-2 py-0.5 rounded-lg  right-0 leading-3 text-[0.7rem] bg-gray-900 text-white'>{word.text_accuracy.toFixed(2)}</span>
    </span>
  </Link>
}

function Line({children}: any) {
  return <div className='mb-2'>
    <div className='flex flex-row justify-start items-start space-x-4'>
      {children}
    </div>
  </div>
}

function Row({ index, line: value }: any) {
  return <Line >
    {value.words.map((word: any) => <Word key={word.index} word={word} />)}
  </Line>
}

export default function Lines({ children }: any) {
  const ref = useRef<any>(null)
  const paginationRef = useRef<any>(null)
  const [lines, setLines] = useState<any[]>([])
  const START_INDEX = 0
  const currentPos = useRef(START_INDEX)
  const [pageNumber, setPageNumber] = useState(1)
  const [pages, setPages] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingNext, setLoadingNext] = useState<boolean>(false)

  const PAGE_SIZE = 20
  const SKIP_SIZE = 500

  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX)

  const getRange = (pageNumber: number): {startIndex: number, stopIndex: number} => {
    const startIndex = (pageNumber - 1) * PAGE_SIZE
    const stopIndex = startIndex + PAGE_SIZE - 1
    return {startIndex, stopIndex}
  }
  const setupPage = (lines: any, startIndex: number, stopIndex: number) => {
    currentPos.current = stopIndex + 1
    window.document.querySelector('[data-virtuoso-scroller="true"]')?.scrollTo(0, 0)
    setFirstItemIndex(startIndex)
    setLines(lines['data'])
    let p = Array(Math.ceil(lines['total'] / PAGE_SIZE)).fill(1).map((_, index)=>index+1)
    setPages(p)
  }

  const onGotoPage = async (e: any) => {
    e.preventDefault()
    const page = parseInt(e.target.getAttribute('data-index'))
    gotoPage(page)
  }

  const onSkipPrev = async (e: any) => {
    e.preventDefault()
    let page = pageNumber - SKIP_SIZE
    page = page > 0 ? page : 1
    gotoPage(page)
  }

  const onSkipNext =async (e: any) => {
    e.preventDefault()
    let page = pageNumber + SKIP_SIZE
    page = page <= pages[pages.length - 1] ? page : pages[pages.length - 1]
    gotoPage(page)
  }

  const gotoPage = async (page: number) => {
    const { startIndex, stopIndex } = getRange(page)
    setPageNumber(page)
    setLines([])
    setFirstItemIndex(0)
    setLoading(true)
    const pageLines = await fetchData(startIndex, stopIndex)
    setLoading(false)
    setupPage(pageLines, startIndex, stopIndex)
  }

  const fetchData = async (startIndex: number, stopIndex: number) => {
    const res = await fetch(`/api/lines?start=${startIndex}&stop=${stopIndex}`)
    const data = await res.json()
    return data
  }

  const loadMore = useCallback( async () => {
    const startIndex = currentPos.current
    const stopIndex = startIndex + (PAGE_SIZE - 1)
    setLoadingNext(true)
    const data = await fetchData(startIndex, stopIndex)
    currentPos.current = stopIndex + 1
    setLines((lines) => {
      lines = [...lines, ...data['data']]
      return lines
    })
    setLoadingNext(false)
  }, [setLines])

  const loadMore2 = useCallback( async () => {
    const usersToPrepend = PAGE_SIZE
    const nextFirstItemIndex = firstItemIndex - usersToPrepend

    if(firstItemIndex < 0 || nextFirstItemIndex < 0){
      setFirstItemIndex(0)
      return
    }
    setLoading(true)
    const data = await fetchData(nextFirstItemIndex, firstItemIndex - 1)
    setFirstItemIndex(nextFirstItemIndex)
    setLines((lines) => [...data['data'], ...lines])
    setLoading(false)
  }, [setLines, firstItemIndex])

  useEffect(()=>{
    window.document.querySelector('[data-virtuoso-scroller="true"]')?.scrollTo(0, 0)
    let mounted = true
    const { startIndex, stopIndex } = getRange(1)
    setLoading(true)
    fetchData(startIndex, stopIndex).then(res => {
      if(mounted)
        setupPage(res, startIndex, stopIndex)
    }).finally(()=>setLoading(false))

    return () => {
      mounted = false;
    }
  }, [])

  const updatePageNumber = ({startIndex, endIndex}: any) => {
    let page = Math.floor(startIndex / PAGE_SIZE) + 1
    setPageNumber(page)
    paginationRef.current.querySelector(`[data-index="${page}"]`)?.scrollIntoView()
  }

  return (
    <>
      <main className="relative z-0 flex-1 flex flex-col pt-2 px-4 sm:px-6 lg:px-8 overflow-y-auto focus:outline-none">
        {/* Start main area*/}
        <div className='py-4 z-10 border-2 rounded-xl px-2'>
          <div className='flex gap-2 items-center'>
            <div className='flex-1'>
              <input className='p-2 border-2 rounded-lg border-gray-400 w-full focus-within:outline-none focus:outline-none' placeholder='Search' type='text' />
            </div>
            <div className='flex'>
              <div className='bg-yellow-300 p-2 rounded-l-xl'><BarsArrowUpIcon className='h-8 w-8 text-gray-400' /></div>
              <div className='bg-green-300 p-2 rounded-r-xl'><BarsArrowDownIcon className='h-8 w-8 text-gray-400' /></div>
            </div>
            <div className='flex'>
              <div className='bg-yellow-300 p-2 rounded-l-xl'><DocumentTextIcon className='h-8 w-8 text-gray-400' /></div>
              <div className='bg-green-300 p-2 rounded-r-xl'><PhotoIcon className='h-8 w-8 text-gray-400' /></div>
            </div>
            <div className='flex'>
              <div className='bg-yellow-300 p-2 rounded-l-xl'><QuestionMarkCircleIcon className='h-8 w-8 text-gray-400' /></div>
              <div className='bg-green-300 p-2 rounded-r-xl'><CheckBadgeIcon className='h-8 w-8 text-gray-400' /></div>
            </div>
          </div>
          <div className='flex gap-2 items-center mt-3'>
            <SelectPage />
            <div className="flex-shrink-0 flex flex-row h-12 w-32 items-stretch gap-4 p-1">
              <p className="flex-1 bg-gray-800 outline rounded-lg outline-offset-2 outline-2 outline-gray-800 flex justify-center items-center text-white">
                <span>EN</span>
              </p>
              <p className="flex-1 outline rounded-lg outline-offset-2 outline-2 outline-gray-800 flex justify-center items-center">
                <span>AR</span>
              </p>
            </div>
            <div className="relative pt-2 pb-1 px-2 flex-1 border rounded-xl">
              <label className='absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900'>Accuracy 32</label>
              <input
                type="range"
                className="
                  w-full
                  h-6
                  p-0
                  focus:outline-none focus:ring-0 focus:shadow-none
                "
                id="customRange1"
              />
            </div>


          </div>
        </div>
        <div className="flex-1 py-3">
          <div data-loading={`${loading ? 'loading' : loadingNext ? 'loading-next' : ''}`} className="relative h-full flex flex-col rounded-lg border-2 border-gray-200 loader-line" >
            <Virtuoso
              ref={ref}
              className='flex-grow m-1'
              firstItemIndex={firstItemIndex}
              initialTopMostItemIndex={0}
              data={lines}
              startReached={loadMore2}
              endReached={loadMore}
              overscan={200}
              itemContent={(index, line) => {
                return <Row index={index} line={line} />
              }}
              rangeChanged={updatePageNumber}
            />

            <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
              <div className="-mt-px flex mr-6">
                <a
                  href="#"
                  onClick={onSkipPrev}
                  className="inline-flex items-center border-t-2 border-transparent py-2 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  <ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Previous
                </a>
              </div>
              <div ref={paginationRef} className="hide-scrollbar hidden md:-mt-px md:flex flex-1 overflow-x-scroll">
                {pages.map((index) => (
                  <a
                    key={index}
                    href="#"
                    data-index={index}
                    data-active={index == pageNumber ? 'active' : ''}
                    onClick={onGotoPage}
                    className="inline-flex items-center border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[active=active]:border-indigo-500 data-[active=active]:text-indigo-600"
                  >
                    {index}
                  </a>))}
              </div>
              <div className="-mt-px flex ml-6 justify-end">
                <a
                  href="#"
                  onClick={onSkipNext}
                  className="inline-flex items-center border-b-2 border-transparent py-2 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Next
                  <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                </a>
              </div>
            </nav>
          </div>
        </div>
        {/* End main area */}
      </main>
      <aside className="relative hidden w-96 flex-shrink-0 overflow-y-auto border-l border-gray-200 xl:flex xl:flex-col">
        {/* Start secondary column (hidden on smaller screens) */}
        <div className="absolute inset-0 py-3 px-4 sm:px-6 lg:px-8">
          <div className="h-full rounded-lg border-2 border-solid border-gray-200 overflow-y-scroll">
            {children}
          </div>
        </div>
        {/* End secondary column */}
      </aside>
    </>
  )
}
