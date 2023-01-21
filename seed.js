const { PrismaClient } = require('@prisma/client')
const fs = require('fs/promises')
const path = require('path')

const prisma = new PrismaClient({
  log: ['query'],
})

function *get_lines(data, page) {
  for(let [section, value] of Object.entries(data['sections'])) {
    let line_index
    for(line_index  in value) {
      line_index = parseInt(line_index)
      let line = value[line_index]
      let words = line['words'].map((word, index)=>({page, section, line_index, index, ...word }))
      let accuracy = Math.min(...words.map((w) => w['text_accuracy']))
      yield ({page, section, index: line_index, bbox: line['bbox'], accuracy, words})
    }
  }
}

async function loadWords(dir) {
  for(let file_path of await fs.readdir(dir)) {
    file_path = path.join(dir, file_path)
    let buffer = await fs.readFile(file_path)
    let page_json = JSON.parse(buffer.toString())
    let name = path.basename(file_path).split('.')[0]
    let data = get_lines(page_json, name)
    let lines = []
    let words = []
    for(let ln of data) {
      let {words: wrds, ...line} = ln
      lines.push(line)
      words.push(...wrds)
    }
    await prisma.line.createMany({data: lines, skipDuplicates: true})
    await prisma.word.createMany({data: words, skipDuplicates: true})
  }
}

async function loadPreditions(dir) {
  for(let file_path of await fs.readdir(dir)) {
    file_path = path.join(dir, file_path)
    let buffer = await fs.readFile(file_path)
    let page_json = JSON.parse(buffer.toString())
    let name = path.basename(file_path).split('.')[0]
    words = []
    for(let key in page_json) {
      let [ section, line_index, index ] = key.split('/')
      line_index = Number(line_index)
      index = Number(index)
      const { text, lang, accuracy } = page_json[key]
      words.push({model: dir, page: name, section, line_index, index, text, lang, accuracy})
    }
    await prisma.prediction.createMany({data: words, skipDuplicates: true})
  }
}

async function main() {
  await loadWords('json_files')
  loadPreditions('fontsize-48')
  loadPreditions('fontsize-52')
}

main()
