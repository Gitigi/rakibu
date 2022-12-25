// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../lib/prisma'

type Data = {
  data: any[],
  total: number,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let start: number = Number(req.query.start || 0)
  let stop: number = Number(req.query.stop || 10)
  
  const lines = await prisma.line.findMany({
    skip: start,
    take: stop - start + 1,
    include: {
      words: true
    }
  })
  // const total = await prisma.line.count()
  const total = (await prisma.$queryRaw<[{count: number}]>`select * from lines_count;`)[0]['count']
  
  res.status(200).json({
    total,
    data: lines,
  })
}
