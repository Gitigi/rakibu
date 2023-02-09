"use client"

import { useContext, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { CheckIcon } from "@heroicons/react/20/solid"

import {RakibuContext, useRakibu} from "./RakibuContext"
import classNames from "@/lib/classNames"

export default function Word({ word, baseUrl }: any) {
  const [ wordDisplay ] = useRakibu<any>('wordDisplay')
  let [ currentWord ] = useRakibu<any>('currentWord')
  let [ openWordEdit ] = useRakibu<any>('openWordEdit')

  word = currentWord?.id == word.id ? currentWord : word

  const height = word.bbox[1][1] - word.bbox[0][1]
  const width = word.bbox[1][0] - word.bbox[0][0]

  return <Link onClick={()=>openWordEdit(true)} href={`${baseUrl}/${word.id}`} data-lang={ word.lang } className='relative flex-shrink-0 inline-flex items-stretch py-1 px-4 text-xl font-semibold text-gray-600 border-2 rounded-sm border-b-8 data-[lang=en]:border-b-green-300 data-[lang=ar]:border-b-blue-300'>
    <div className="flex">
      <div className="leading-3 space-y-1">
        { (wordDisplay?.text || !wordDisplay?.image) && <span className="inline-block font-amiri text-xl">{ word.text }</span> }
        { wordDisplay?.image && <Image height={height} width={width} src={`/api/images/${word.page}/${word.section}/${word.line_index}/${word.index}`} className='max-h-[27px] w-auto' alt="word" /> }
      </div>
      
      <span className={classNames(
        'ml-2 py-0.5 px-2 rounded-lg leading-3 text-[0.7rem] bg-gray-900 text-white',
        wordDisplay?.text && wordDisplay.image ? 'self-start mt-2' : 'self-center'
        )}
      >
        { word.rakibu ? 
            <CheckIcon className="w-3 h-3" /> :
            word.text_accuracy.toFixed(2)
        }
      </span>
    </div>
  </Link>
}
