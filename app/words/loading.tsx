export default function Loading() {
  return <div className="h-full flex flex-col gap-2 items-stretch animate-pulse p-4">
    <div className="h-14 rounded-xl bg-slate-200"></div>
    <div className="h-14 rounded-xl bg-slate-200"></div>
    <div className="flex gap-2 h-14">
      <div className="w-1/2 rounded-xl bg-slate-200"></div>
      <div className="w-1/2 rounded-xl bg-slate-200"></div>
    </div>
    <div className="grid grid-cols-2 items-stretch gap-2 bg-slate-200 p-2 rounded-xl">
      {Array(5).fill(true).map((_,i) => <div key={i} className="h-14 rounded-xl"></div>)}
    </div>
    <div className="bg-slate-200 h-32 rounded-xl"></div>
    <div className="h-14 w-full mt-auto rounded-xl bg-slate-200 self-end"></div>
  </div>
}
