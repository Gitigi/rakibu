"use client"

import { useEffect, useRef, useState } from "react"
import { Virtuoso } from 'react-virtuoso'
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'

import Line from "@/ui/Line"
import Word from "@/ui/Word"

const groupWords = (data: any[], groupSize: number) => {
  return data.reduce((accumulator: any[], currentValue:any, index:number) => {
    if( index % groupSize === 0) {
      accumulator.push({words: [currentValue]})
    } else {
      accumulator.at(-1)?.words.push(currentValue)
    }
    return accumulator
  }, [])
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

export default function WordList({ filter }: any) {
  const ref = useRef<any>(null)
  const paginationRef = useRef<any>(null)
  const [lines, setLines] = useState<any[]>([])
  const START_INDEX = 0
  const currentPos = useRef(START_INDEX)
  const [pageNumber, setPageNumber] = useState(1)
  const [pages, setPages] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingNext, setLoadingNext] = useState<boolean>(false)
  const endReached = useRef<boolean>(false)

  const PAGE_SIZE = 20
  const SKIP_SIZE = 500
  const GROUP_SIZE = 6

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
    endReached.current = false
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

  const fetchData = async (startIndex: number, stopIndex: number, filter: any) => {
    startIndex *= GROUP_SIZE
    stopIndex = (stopIndex + 1) * GROUP_SIZE - 1
    let query: any = {'start': startIndex.toString(), 'stop': stopIndex.toString(), ...getQuery(filter)}
    query = new URLSearchParams(query)
    const res = await fetch(`/api/words?${query.toString()}`)
    const data = await res.json();
    data['data'] = groupWords(data['data'], GROUP_SIZE)
    data['total'] = Math.ceil(data['total'] / GROUP_SIZE)
    return data
  }

  const loadNext = async () => {
    if(endReached.current) return
    
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

    if(!data['data'].length) {
      endReached.current = true
    }
  }

  const loadPrev = async () => {
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
      if(mounted)
        setupPage(res, startIndex, stopIndex)
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

  return (
    <div data-loading={`${loading ? 'loading' : loadingNext ? 'loading-next' : ''}`} className="relative h-full flex flex-col rounded-lg border-2 border-gray-200 loader-line" >
      <Virtuoso
        ref={ref}
        className='flex-grow m-1'
        firstItemIndex={firstItemIndex}
        initialTopMostItemIndex={0}
        data={lines}
        startReached={loadPrev}
        endReached={loadNext}
        overscan={200}
        itemContent={(index, line) => {
          return <Line>
            {line.words.map((word: any) => <Word key={word.id} word={word} baseUrl="/words" />)}
          </Line>
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
  )
}
