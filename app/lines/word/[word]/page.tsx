import Image from "next/image"

import WordEdit from "@/ui/WordEdit"
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

  return <div className="h-full flex flex-col gap-y-2">
    <WordEdit word={word} />
  </div>
}