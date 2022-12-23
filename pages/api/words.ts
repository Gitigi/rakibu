// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data: any[],
  total: number,
}

type Query = {
  start?: number,
  stop?: number
}

let words: any[] = [];

function loadWords() {
  if(words.length) return;
  let text = fs.readFileSync('./words.json')
  words = JSON.parse(text.toString())
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  loadWords()
  const { start = 0, stop = 10 }: Query = req.query;
  res.status(200).json({
    total: words.length,
    data: words.slice(start, stop),
  })
}
