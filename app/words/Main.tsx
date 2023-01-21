"use client"

import { useState } from "react"

import WordFilter from "@/ui/WordFilter"
import type { FilterQuery } from "@/ui/WordFilter"
import WordList from "./WordList"

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
      <WordList filter={filter} />
    </div>
  </>
}
