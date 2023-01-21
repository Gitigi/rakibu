// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/lib/prisma'

type Data = {
  data: any[],
  total: number,
  start: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let start: number = Number(req.query.start || 0)
  let stop: number = Number(req.query.stop || 10)
  let accuracy: number = Number(req.query.accuracy || 100) / 100
  let order: any = req.query.order
  let searchText: any = req.query.search
  let rakibu: any = req.query.rakibu ? req.query.rakibu === 'true' : undefined
  let language: any = req.query.language ? req.query.language.toString().split(',') : undefined
  let page: any = req.query.page

  const lines = await prisma.line.findMany({
    where: {
      accuracy: { lte: accuracy},
      page: page,
      words: {
        some: {
          text: {
            contains: searchText
          },
          rakibu: rakibu,
          lang: {
            in: language
          }
        }
      },
    },
    orderBy: {
      accuracy: order
    },
    skip: start,
    take: stop - start + 1,
    include: {
      words: true
    }
  })
  const total = await prisma.line.count({
    where: {
      accuracy: { lte: accuracy},
      page: page,
      words: {
        some: {
          text: {
            contains: searchText
          },
          rakibu: rakibu,
          lang: {
            in: language
          }
        }
      },
    }
  })
  
  res.status(200).json({
    total,
    start,
    data: lines,
  })
}
