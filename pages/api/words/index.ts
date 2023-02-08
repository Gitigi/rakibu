import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/lib/prisma'
import { Prisma, Word } from '@prisma/client'

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
  let accuracy: number = Number(req.query.accuracy || 100) / 100
  let order: any = req.query.order
  let searchText: any = req.query.search
  let rakibu: any = req.query.rakibu ? req.query.rakibu === 'true' : undefined
  let language: any = req.query.language ? req.query.language.toString().split(',') : undefined
  let page: any = req.query.page
  let modeSensitive: any = req.query.modeSensitive ? req.query.modeSensitive === 'true' : undefined
  let modeWord: any = req.query.modeWord ? req.query.modeWord === 'true' : undefined
  let modeRegex: any = req.query.modeRegex ? req.query.modeRegex === 'true' : undefined

  let operation: string = 'ilike'
  if(searchText) {
    if(!modeRegex) {
      if(modeSensitive) operation = 'like'
      if(!modeWord) searchText = `%${searchText}%`
    } else {
      try{
        // validate postgres regex by running it
        await prisma.$queryRaw`select * from (VALUES('text'),('text2')) AS text(text) where text ~ ${searchText}`
        operation = 'regex'
      }catch(e) {}
    }
  }

  if(searchText && (operation == 'like' || operation == 'ilike')) {
    searchText = searchText.replace(new RegExp(String.raw`\\+`), '')
  }
  
  const textQuery: {[key: string]: any} = {
    ilike: Prisma.sql`text ilike ${searchText}`,
    like: Prisma.sql`text like ${searchText}`,
    regex: Prisma.sql`text ~ ${searchText}`
  }

  const orderBy: {[key: string]: any} = {
    'asc': Prisma.sql`order by text_accuracy asc`,
    'desc': Prisma.sql`order by text_accuracy desc`
  }

  let whereClause = Prisma.sql`where true
  ${accuracy ? Prisma.sql`and text_accuracy <= ${accuracy}` : Prisma.empty}
  ${searchText ? Prisma.sql` and ${textQuery[operation]}` : Prisma.empty}
  ${page ? Prisma.sql`and page = ${page}` : Prisma.empty}
  ${rakibu !== undefined ? Prisma.sql`and rakibu = ${rakibu}` : Prisma.empty}
  ${language ? Prisma.sql`and lang in (${Prisma.join(language)})` : Prisma.empty}
  `
  
  const words = await prisma.$queryRaw<Word[]>`select word.* from public.word ${whereClause} ${order ? orderBy[order] : Prisma.sql`order by word.id asc`} limit ${stop - start} offset ${start}`
  let total = await prisma.$queryRaw<any>`select count(id) from public.word ${whereClause}`
  total = total[0]['count']
  
  res.status(200).json({
    total,
    data: words,
  })
}
