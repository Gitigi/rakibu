import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'

type Data = {
  data: any[],
  total: number,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const id = Number(req.query.id)

  const word = await prisma.word.findUnique({
    where: {
      id
    },
    include: {
      line: {
        include: {
          words: true
        }
      }
    }
  })

  res.status(200).json(word)
}
