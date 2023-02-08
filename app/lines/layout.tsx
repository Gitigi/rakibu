
import prisma from '@/lib/prisma'
import Main from './Main'
import Aside from '@/ui/Aside'

export default async function Layout({ children }: any) {
  const pages = (await prisma.$queryRaw<[{page: string}]>`select distinct page as page from line order by page asc;`).map(v => v['page'])

  return (
    <>
      <main className="relative z-0 flex-1 flex flex-col pt-2 px-4 xl:px-8 overflow-y-auto focus:outline-none">
        {/* Start main area*/}
        <Main pages={pages} />
        {/* End main area */}
      </main>
      <Aside> { children }</Aside>
    </>
  )
}
