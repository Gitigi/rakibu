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
          words: {
            select: {
              id: true,
              text: true,
              bbox: true,
              page: true,
              section: true,
              line_index: true,
              index: true
            }
          }
        }
      }
    }
  })

  word.created_at = word.created_at.toString()
  word.updated_at = word.updated_at.toString()

  return <div className="h-full flex flex-col gap-y-2">
    <WordEdit word={word} />
  </div>
}