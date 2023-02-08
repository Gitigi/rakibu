// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'

import prisma from '@/lib/prisma'

sharp.cache({items: 400, memory: 200})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {page, section, line: line_idx, word: word_idx}: any = req.query
  const word: any = await prisma.word.findFirst({
    select: {
      bbox: true
    },
    where: {
      page,
      section,
      line_index: parseInt(line_idx),
      index: parseInt(word_idx)
    }
  })
  
  let [[x1, y1], [x2, y2]] = word['bbox']
  let width = x2 - x1
  let height = y2 - y1
  let img = await sharp(`page_images/${page}.png`).extract({ width, height, left: x1, top: y1 }).png().toBuffer()
  res.setHeader('Content-Type', 'image/png')
  res.status(200).send(img)
}

