"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from 'next/link'
import { Virtuoso } from 'react-virtuoso'
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'

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

const getQuery = (filter: any): {[key: string]: any} => {
  return Object.keys(filter || {}).reduce((acc: any, currentValue: string) => {
    let v = filter[currentValue]
    if((v && !Array.isArray(v) || v?.length) || v === false) {
      acc[currentValue] = v
    }
    return acc
  }, {})
}

const fetchData = async (startIndex: number, stopIndex: number, filter: any) => {
  let query: any = {'start': startIndex.toString(), 'stop': stopIndex.toString(), ...getQuery(filter)}
  query = new URLSearchParams(query)
  const res = await fetch(`/api/lines?${query.toString()}`)
  const data = await res.json()
  return data
}

export default function LineList({ filter }: any) {
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
    const pageLines = await fetchData(startIndex, stopIndex, filter)
    setLoading(false)
    setupPage(pageLines, startIndex, stopIndex)
  }

  const loadMore = async () => {
    const startIndex = currentPos.current
    const stopIndex = startIndex + (PAGE_SIZE - 1)
    setLoadingNext(true)
    const data = await fetchData(startIndex, stopIndex, filter)
    currentPos.current = stopIndex + 1
    setLines((lines) => {
      lines = [...lines, ...data['data']]
      return lines
    })
    setLoadingNext(false)
  }

  const loadMore2 = async () => {
    const usersToPrepend = PAGE_SIZE
    const nextFirstItemIndex = firstItemIndex - usersToPrepend

    if(firstItemIndex < 0 || nextFirstItemIndex < 0){
      setFirstItemIndex(0)
      return
    }
    setLoading(true)
    const data = await fetchData(nextFirstItemIndex, firstItemIndex - 1, filter)
    setFirstItemIndex(nextFirstItemIndex)
    setLines((lines) => [...data['data'], ...lines])
    setLoading(false)
  }

  useEffect(()=>{
    window.document.querySelector('[data-virtuoso-scroller="true"]')?.scrollTo(0, 0)
    let mounted = true
    const { startIndex, stopIndex } = getRange(1)
    setLoading(true)
    fetchData(startIndex, stopIndex, filter).then(res => {
      if(mounted) {
        setupPage(res, startIndex, stopIndex)
      }
    }).finally(()=>setLoading(false))

    return () => {
      mounted = false;
    }
  }, [filter])

  const updatePageNumber = ({startIndex, endIndex}: any) => {
    let page = Math.floor(startIndex / PAGE_SIZE) + 1
    setPageNumber(page)
    paginationRef.current.querySelector(`[data-index="${page}"]`)?.scrollIntoView()
  }

  return <div data-loading={`${loading ? 'loading' : loadingNext ? 'loading-next' : ''}`} className="relative h-full flex flex-col rounded-lg border-2 border-gray-200 loader-line" >
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
}