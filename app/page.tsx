"use client"
import { useRef, useCallback, useState, useEffect, MouseEventHandler } from 'react'
import { Virtuoso } from 'react-virtuoso'

import Image from 'next/image'
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'

import { Popover, Transition } from '@headlessui/react'
import { usePopper } from 'react-popper'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'

function IconOne() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#FFEDD5" />
      <path
        d="M24 11L35.2583 17.5V30.5L24 37L12.7417 30.5V17.5L24 11Z"
        stroke="#FB923C"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.7417 19.8094V28.1906L24 32.3812L31.2584 28.1906V19.8094L24 15.6188L16.7417 19.8094Z"
        stroke="#FDBA74"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.7417 22.1196V25.882L24 27.7632L27.2584 25.882V22.1196L24 20.2384L20.7417 22.1196Z"
        stroke="#FDBA74"
        strokeWidth="2"
      />
    </svg>
  )
}

function IconTwo() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#FFEDD5" />
      <path
        d="M28.0413 20L23.9998 13L19.9585 20M32.0828 27.0001L36.1242 34H28.0415M19.9585 34H11.8755L15.9171 27"
        stroke="#FB923C"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.804 30H29.1963L24.0001 21L18.804 30Z"
        stroke="#FDBA74"
        strokeWidth="2"
      />
    </svg>
  )
}

function IconThree() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#FFEDD5" />
      <rect x="13" y="32" width="2" height="4" fill="#FDBA74" />
      <rect x="17" y="28" width="2" height="8" fill="#FDBA74" />
      <rect x="21" y="24" width="2" height="12" fill="#FDBA74" />
      <rect x="25" y="20" width="2" height="16" fill="#FDBA74" />
      <rect x="29" y="16" width="2" height="20" fill="#FB923C" />
      <rect x="33" y="12" width="2" height="24" fill="#FB923C" />
    </svg>
  )
}

const solutions = [
  {
    name: 'Insights',
    description: 'Measure actions your users take',
    href: '##',
    icon: IconOne,
  },
  {
    name: 'Automations',
    description: 'Create your own targeted content',
    href: '##',
    icon: IconTwo,
  },
  {
    name: 'Reports',
    description: 'Keep track of your growth',
    href: '##',
    icon: IconThree,
  },
]

function Word({word}: any) {
  const ref = useRef<any>(null)
  const height = word.bbox[1][1] - word.bbox[0][1]
  const width = word.bbox[1][0] - word.bbox[0][0]
  return <div ref={ref}  key={word.index} data-lang={word.lang} className='relative flex-shrink-0 inline-flex items-stretch py-1 px-4 text-xl font-semibold text-gray-600 border-2 rounded-sm border-b-8 data-[lang=en]:border-b-green-300 data-[lang=ar]:border-b-blue-300'>
    {/* <Image height={height} width={width} src={`/api/images/${word.page}/${word.section}/${word.line_index}/${word.index}`} className='max-h-[27px] w-auto' alt="word" /> */}
    {word.text}
    {/* <span className='inline-flex items-center'>
      <span className='ml-2 px-2 py-0.5 rounded-lg  right-0 leading-3 text-[0.7rem] bg-gray-900 text-white'>{word.text_accuracy.toFixed(2)}</span>
    </span> */}
    <MyButton word={word} parentRef={ref}/>
  </div>
}

function Line({children}: any) {
  return <div className='mb-2'>
    <div className='flex flex-row justify-start items-start space-x-4'>
      {children}
    </div>
  </div>
}

function Row({ index, line: value }: any) {
  if(!value)
    return <p >Loading...</p>

  return <Line >
    {value.words.map((word: any) => <Word key={word.index} word={word} />)}
  </Line>
}

function MyButton({ word, parentRef }: any) {
  let [referenceElement, setReferenceElement] = useState<any>()
  let [popperElement, setPopperElement] = useState<any>()
  // let { styles, attributes } = usePopper(referenceElement, popperElement)
  let { styles, attributes } = usePopper(parentRef.current, popperElement, {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 4],
        },
      },
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['top', 'right', 'left', 'bottom'],
        },
      }
    ],
  })

  const buttonRef = useRef<any>(null)
  const timeoutDuration = 200
  let timeout: any

  const onMouseEnter = (open: boolean) => {
    clearTimeout(timeout)
    if (open) return
    return buttonRef.current?.click()
  }

  const onMouseLeave = (open: boolean, close: ()=>any) => {
    if (!open) return
    timeout = setTimeout(() => close(), timeoutDuration)
  }

  useEffect(()=>{
    buttonRef.current = referenceElement
  }, [referenceElement])
  
  return (
    <Popover className="relative">
      {({ open, close }) => (
        <div 
          // onMouseLeave={onMouseLeave.bind(null, open, close)}
        >
          <Popover.Button
            ref={setReferenceElement}
            className='inline-flex items-center focus-visible:outline-none'
            onMouseEnter={onMouseEnter.bind(null, open)}
            // onMouseLeave={onMouseLeave.bind(null, open, close)}
          >
            <span className='ml-2 px-2 py-0.5 rounded-lg  right-0 leading-3 text-[0.7rem] bg-gray-900 text-white'>{word.text_accuracy.toFixed(2)}</span>
          </Popover.Button>
          <Transition
            as={Fragment}
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
            >
            <div  className="absolute z-10">
              <Popover.Panel {...attributes.popper} style={styles.popper} ref={setPopperElement} className="group absolute w-screen px-4 sm:px-0 lg:max-w-xs">
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
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                  // onMouseEnter={onMouseEnter.bind(null, open)}
                  // onMouseLeave={onMouseLeave.bind(null, open, close)}
                >
                  <div className="relative grid gap-8 bg-white p-7">
                    {solutions.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                          <item.icon aria-hidden="true" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="bg-gray-50 p-4">
                    <a
                      href="##"
                      className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <span className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          Documentation
                        </span>
                      </span>
                      <span className="block text-sm text-gray-500">
                        Start integrating products and tools
                      </span>
                    </a>
                  </div>
                </div>
              </Popover.Panel>
            </div>
          </Transition>
        </div>
      )}
    </Popover>
  )
}

export default function Home() {
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
    console.log(`page = ${page}`)
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
    const stopIndex = startIndex + 19
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
    const usersToPrepend = 20
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
      <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
        {/* Start main area*/}
        <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
          <div data-loading={`${loading ? 'loading' : loadingNext ? 'loading-next' : ''}`} className="relative h-full flex flex-col rounded-lg border-2 border-gray-200 loader-line" >
            <Virtuoso
              ref={ref}
              className='flex-grow'
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
        <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
          <div className="h-full rounded-lg border-2 border-dashed border-gray-200" />
        </div>
        {/* End secondary column */}
      </aside>
    </>
  )
}
