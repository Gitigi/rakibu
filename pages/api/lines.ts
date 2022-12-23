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

let lines: any[] = [];

function loadLines() {
  if(lines.length) return;
  let text = fs.readFileSync('./lines.json')
  lines = JSON.parse(text.toString())
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  loadLines()
  const { start = 0, stop = 10 }: Query = req.query;
  res.status(200).json({
    total: lines.length,
    data: lines.slice(start, stop),
  })
}
