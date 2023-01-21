import WordFilter from '@/ui/WordFilter'
import LineList from '@/ui/LineList'
import Pages from './Pages'
import prisma from '@/lib/prisma'

export default async function Layout({ children }: any) {
  const pages = (await prisma.$queryRaw<[{page: string}]>`select distinct page as page from line order by page asc;`).map(v => v['page'])

  return (
    <>
      <main className="relative z-0 flex-1 flex flex-col pt-2 px-4 sm:px-6 lg:px-8 overflow-y-auto focus:outline-none">
        {/* Start main area*/}
        <div className='py-4 z-10 border-2 rounded-xl px-2'>
          <WordFilter pages={pages} />
        </div>
        <div className="flex-1 py-3">
          <LineList />
        </div>
        {/* End main area */}
      </main>
      <aside className="relative hidden w-96 flex-shrink-0 overflow-y-auto border-l border-gray-200 xl:flex xl:flex-col">
        {/* Start secondary column (hidden on smaller screens) */}
        <div className="absolute inset-0 py-3 px-4 sm:px-6 lg:px-8">
          <div className="h-full rounded-lg border-2 border-solid border-gray-200 overflow-y-hidden">
            {children}
          </div>
        </div>
        {/* End secondary column */}
      </aside>
    </>
  )
}
