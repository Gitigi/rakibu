import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/lib/prisma'

type Data = {
  data: any[],
  total: number,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const id = Number(req.query.id)

  if(req.method === 'POST') {
    const body = req.body
    await prisma.word.update({
      data: {
        text: body.text,
        lang: body.lang,
        rakibu: true
      },
      where: {
        id
      }
    })
  }
  const word = await prisma.word.findUnique({
    where: {
      id
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
  res.status(200).json(word)
}
