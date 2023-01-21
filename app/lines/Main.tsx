"use client"

import { useEffect, useState } from "react"
import WordFilter from "@/ui/WordFilter"
import type { FilterQuery } from "@/ui/WordFilter"
import LineList from '@/ui/LineList'

function processFilter(filter: any) {
  const f: any = {}
  Object.keys(filter).reduce((acc: any, currentValue: string) => {
    if(filter[currentValue] !== null || filter[currentValue] !== undefined) {
      acc[currentValue] = filter[currentValue]
    }
    return acc
  }, {})
}

export default function Main({ pages }: any) {
  const [filter, setFilter] = useState<FilterQuery>({
    search: '',
    order: '',
    rakibu: null,
    page: '',
    language: null,
    accuracy: 100
  });

  return <>
    <div className='py-4 z-10 border-2 rounded-xl px-2'>
      <WordFilter pages={pages} filter={filter} setFilter={setFilter} />
    </div>
    <div className="flex-1 py-3">
      <LineList filter={filter} />
    </div>
  </>
}