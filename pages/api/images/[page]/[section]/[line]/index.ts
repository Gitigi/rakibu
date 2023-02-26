// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'

import prisma from '@/lib/prisma'

sharp.cache({items: 400, memory: 200})

export const config = {
  api: {
    externalResolver: true,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {page, section, line: line_idx}: any = req.query
  const line: any = await prisma.line.findFirst({
    select: {
      bbox: true
    },
    where: {
      page,
      section,
      index: parseInt(line_idx)
    }
  })
  let bbox = line.bbox
  let left = bbox[0][0] - 20
  let top = bbox[0][1] - 10
  let width = (bbox[1][0] - bbox[0][0]) + 40
  let height = (bbox[1][1] - bbox[0][1]) + 20
  let img = await sharp(`page_images/${page}.png`).extract({ width, height, left, top }).png().toBuffer()
  res.setHeader('Content-Type', 'image/png')
  res.status(200).send(img)
}
