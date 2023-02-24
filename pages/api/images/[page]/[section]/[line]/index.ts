// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'
import fs from 'fs/promises'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {page, section, line: line_idx}: any = req.query
  const data = await fs.readFile(`json_files/${page}.json`, { encoding: 'utf8' });
  const page_json = JSON.parse(data)
  let line = page_json['sections'][section][line_idx]
  let bbox = line['bbox']
  let left = bbox[0][0] - 20
  let top = bbox[0][1] - 10
  let width = (bbox[1][0] - bbox[0][0]) + 40
  let height = (bbox[1][1] - bbox[0][1]) + 20
  let img = await sharp(`page_images/${page}.png`).extract({ width, height, left, top }).png().toBuffer()
  res.setHeader('Content-Type', 'image/png')
  res.status(200).send(img)
}

