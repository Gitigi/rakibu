import Image from "next/image"

import WordEdit from '@/ui/WordEdit'
import prisma from '@/lib/prisma'

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
      predictions: true,
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
    <WordEdit word={word} />
  </div>
}