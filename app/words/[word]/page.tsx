import WordEdit from '@/ui/WordEdit'
import prisma from '@/lib/prisma'

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