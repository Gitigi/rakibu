"use client"

import { Fragment, useEffect, useMemo, useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { CheckBadgeIcon, EyeIcon } from '@heroicons/react/20/solid'

import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { Prediction } from "@prisma/client"
import classNames from "@/lib/classNames"
import WordInput from "./WordInput"
import { useRakibu } from "./RakibuContext"

function WordImage({ word }: any) {
  const path = usePathname()
  const url = path?.replace(path.substring(path.lastIndexOf('/')), `/${word.id}`) || ""
  const height = word.bbox[1][1] - word.bbox[0][1]
  const width = word.bbox[1][0] - word.bbox[0][0]
  return <Link href={url} className="p-1 rounded-md shadow-gray-300 hover:-translate-y-0.5 hover:shadow-md ">
    <Image className="" height={height} width={width} src={`/api/images/${word.page}/${word.section}/${word.line_index}/${word.index}`} alt="word" />
  </Link>
}

function LineImage({ word }: any) {
  const path = usePathname()
  const height = word.bbox[1][1] - word.bbox[0][1]
  const width = word.bbox[1][0] - word.bbox[0][0]
  return <div>
    <Image className="" height={height} width={width} src={`/api/images/${word.page}/${word.section}/${word.index}`} alt="line" />
  </div>
}

export default function WordPanel({ word }: any) {
  const [text, setText] = useState<string>(word.text)
  const [manualText, setManualText] = useState<string>('')
  const [language, setLanguage] = useState<string>(word.lang)
  const [edited, setEdited] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [currentWord, setCurrentWord] = useRakibu('currentWord')
  const languages = ['en', 'ar']
  let [isLineImageOpen, setLineImageOpen] = useState(false)

  const predictions = useMemo<string[]>(()=>{
    let pred = word.predictions.sort((a: Prediction, b: Prediction) => {
      if(a.model < b.model) return -1
      else if(a.model > b.model) return 1
      else if( a.model === b.model) return 0
    }).reverse()
    return Array.from(
      new Set(pred.filter((w: any) => w.lang === language).map((w: any) => w.text))
    )
  }, [word.predictions, language])

  const height = word.bbox[1][1] - word.bbox[0][1]
  const width = word.bbox[1][0] - word.bbox[0][0]

  const onManualEntry = (e: any) => {
    setManualText(e.target.value)
    setText(e.target.value)
  }

  const onPredictionClick = ( e: any ) => {
    const value = e.currentTarget.value
    setText(value)
    setManualText(value)
  }
  
  useEffect(() => {
    setEdited((language !== word.lang) || (text !== word.text))
  }, [text, language, word.lang, word.text])

  useEffect(() => {
    setCurrentWord({...word, text, lang: language})
  }, [word, text, language, setCurrentWord])

  const save = async () => {
    setLoading(true)
    try{
      const res = await fetch(`/api/words/${word.id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          lang: language
        })
      })
      const data = await res.json()
      setLoading(false)
      startTransition(() => {
        router.refresh();
      });
    } catch(e) {
      console.log(e)
      setLoading(false)
    }
  }

  const isMutating = loading || isPending;

  function closeLineImageModal() {
    setLineImageOpen(false)
  }

  function openLineImageModal() {
    setLineImageOpen(true)
  }

  return <>
    <div className="flex-1 flex flex-col p-2 gap-y-2 overflow-y-scroll">
      <div className="border-2 flex-shrink-0 border-blue-100 rounded-lg self-stretch bg-gray-50 h-12 flex justify-center items-center">
        <Image className="" height={height} width={width} src={`/api/images/${word.page}/${word.section}/${word.line_index}/${word.index}`} alt="word" />
      </div>
      <button onClick={_ => setManualText(text)} className="relative border-2 flex-shrink-0 border-blue-100 rounded-lg py-1 text-center self-stretch text-gray-600">
        <span className="font-amiri font-bold text-3xl whitespace-normal break-normal">{ text }</span>
        {word.rakibu && <div className="h-full absolute right-0 top-0 align-middle"><CheckBadgeIcon className="h-8 w-8 text-blue-500 inline-block" /></div>}
        {!text && <span className="invisible">_</span>}
      </button>
      <RadioGroup value={language} onChange={setLanguage} className="p-1">
        <RadioGroup.Label className="sr-only">Choose a language</RadioGroup.Label>
        <div className="flex items-center space-x-3">
          {languages.map((lang: String, index: number) => (
            <RadioGroup.Option
              key={index}
              value={lang}
              className={({ active, checked }) =>
                classNames(
                  active || checked ? 'bg-gray-800 text-white' : 'bg-white text-gray-800',
                  'p-2 flex-1 outline rounded-lg outline-offset-2 outline-2 outline-gray-800 flex justify-center items-center'
                )
              }
            >
              <RadioGroup.Label as="span" className="sr-only">{ lang }</RadioGroup.Label>
              <span className="uppercase">{ lang }</span>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      <div className="flex-1 min-h-[220px] bg-gray-100 p-2 rounded-lg flex flex-col gap-2">
        <WordInput value={manualText} onChange={onManualEntry} language={language} />
        <div
          className="h-full flex content-start flex-wrap gap-2 overflow-y-scroll">
          {predictions.map((p: string, index: number) => (
            <button value={p} key={index} onClick={onPredictionClick} className={classNames(
              p === text ? 'bg-green-400 text-white' : 'bg-white text-gray-800',
              "font-amiri text-xl",
              "h-fit px-2 py-1 border-2 border-gray-400 rounded-lg flex justify-center items-center"
              )}
            >
              <span>{ p }</span>
            </button>)
          )}
        </div>
      </div>
      <div className="bg-white border-2 rounded-lg flex flex-col gap-2">
        <div className="p-2 flex flex-row flex-wrap gap-2 items-center">
          {word.line.words.map((w: any, index: number) => (
            <WordImage key={w.id} word={w} />
          ))}
        </div>
        <div className="item-end rounded-b-lg bg-gray-900 flex justify-center py-2">
          <p className="text-white">
            <span>{word.line.page}</span>&nbsp;
            <span>{word.line.section}-{word.line.index}</span>
            <span className="mx-2 my-1 cursor-pointer" onClick={openLineImageModal}><EyeIcon className="w-4 h-4 inline-block" /></span>
          </p>
        </div>
      </div>
    </div>
    <button disabled={isMutating} onClick={save} className={classNames(
      isMutating ? 'bg-blue-300 outline-blue-300' : 'bg-blue-500 outline-blue-600',
      " p-4 text-white font-semibold rounded-b-lg flex justify-center items-center"
      )}
    >
      { isMutating ? <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg> : null }
      { edited ? 'Save' : 'Approve' }
    </button>
    <Transition appear show={isLineImageOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeLineImageModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="mt-2">
                    <LineImage word={word.line} />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    <div id="keyboard" className="relative w-full"/>
  </>
}
