import { prisma } from './lib/prisma'
import fs from 'fs/promises'
import path from 'path'

function *get_lines(data: any, page: string) {
  for(let [section, value] of Object.entries<any[]>(data['sections'])) {
    let line_index: string | number
    for(line_index  in value) {
      line_index = parseInt(line_index)
      let line = value[line_index]
      let words = line['words'].map((word: any, index: number)=>({page, section, line_index, index, ...word }))
      let accuracy = Math.min(...words.map((w: any) => w['text_accuracy']))
      yield ({page, section, index: line_index, bbox: line['bbox'], accuracy, words})
    }
  }
}

export default async function main() {
  const dir = 'json_files'
  for(let file_path of await fs.readdir(dir)) {
    file_path = path.join(dir, file_path)
    let buffer = await fs.readFile(file_path)
    let page_json = JSON.parse(buffer.toString())
    let name = path.basename(file_path).split('.')[0]
    let data: any = get_lines(page_json, name)
    let lines: any[] = []
    let words: any[] = []
    for(let ln of data) {
      let {words: wrds, ...line} = ln
      lines.push(line)
      words.push(...wrds)
    }
    await prisma.line.createMany({data: lines, skipDuplicates: true})
    await prisma.word.createMany({data: words, skipDuplicates: true})
  }
}

