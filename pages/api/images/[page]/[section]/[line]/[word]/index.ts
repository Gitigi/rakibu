// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'
import fs from 'fs/promises'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(sharp.cache())
  const {page, section, line: line_idx, word: word_idx}: any = req.query
  const data = await fs.readFile(`json_files/${page}.json`, { encoding: 'utf8' });
  const page_json = JSON.parse(data)
  let word = page_json['sections'][section][line_idx]['words'][word_idx]
  let bbox = word['bbox']
  let width = bbox[1][0] - bbox[0][0]
  let height = bbox[1][1] - bbox[0][1]
  let img = await sharp(`page_images/${page}.png`).extract({ width, height, left: bbox[0][0], top: bbox[0][1] }).png().toBuffer()
  res.setHeader('Content-Type', 'image/png')
  res.status(200).send(img)
}

