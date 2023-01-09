import Image from "next/image"

import prisma from '../../../../lib/prisma'

function WordImage({ word }: any) {
  const height = word.bbox[1][1] - word.bbox[0][1]
  const width = word.bbox[1][0] - word.bbox[0][0]
  return <Image className="" height={height} width={width} src={`/api/images/${word.page}/${word.section}/${word.line_index}/${word.index}`} alt="word" />
}

export default async function Word({ params }: any) {
  const word: any = await prisma.word.findUnique({
    where: {
      id: Number(params.word)
    },
    include: {
      line: {
        include: {
          words: true
        }
      }
    }
  })
  const height = word.bbox[1][1] - word.bbox[0][1]
  const width = word.bbox[1][0] - word.bbox[0][0]

  let predictions = [];
  for(let c = 0; c < 5; c++) {
    let w = ''
    for(let i = 0; i < word.text.length; i++) {
      w += word.text[Math.round(Math.random() * 10) % word.text.length]
    }
    predictions.push(w)
  }
  predictions[Math.round(Math.random() * 10) % 5] = word.text
  console.log(predictions)

  
  return <div className="h-full flex flex-col gap-y-2">
    <div className="flex-1 flex flex-col p-4 gap-y-2 overflow-scroll">
      <div className="border-2 flex-shrink-0 border-blue-100 rounded-lg self-stretch bg-gray-50 h-12 flex justify-center items-center">
        <Image className="" height={height} width={width} src={`/api/images/${word.page}/${word.section}/${word.line_index}/${word.index}`} alt="word" />
      </div>
      <p className="border-2 flex-shrink-0 border-blue-100 rounded-lg py-1 text-center self-stretch text-3xl tracking-widest font-semibold text-gray-600 overflow-x-scroll">
        { word.text }
      </p>
      <div className="flex-shrink-0 flex flex-row h-12 items-stretch gap-4 p-1">
        <p className="flex-1 bg-gray-800 outline rounded-lg outline-offset-2 outline-2 outline-gray-800 flex justify-center items-center text-white">
          <span>EN</span>
        </p>
        <p className="flex-1 outline rounded-lg outline-offset-2 outline-2 outline-gray-800 flex justify-center items-center">
          <span>AR</span>
        </p>
      </div>
      <div className="bg-gray-100 p-2 rounded-lg flex flex-row flex-wrap gap-2">
        {predictions.map((w, index) => (
          <p key={index} className="h-10 p-2 border-2 border-gray-400 rounded-lg flex justify-center items-center text-xl">
            <span>{ w }</span>
          </p>)
        )}
        <input type="text" className="mt-2 w-full h-11 rounded-sm px-2 text-lg" placeholder="rakibu" />
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
          </p>
        </div>
      </div>
    </div>
    <button className=" p-4 bg-blue-500 outline-blue-600 text-white font-semibold rounded-b-lg">
      Approve
    </button>
  </div>
}