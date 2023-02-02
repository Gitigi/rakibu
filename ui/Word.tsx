import Link from "next/link"

export default function Word({ word, baseUrl }: any) {
  const height = word.bbox[1][1] - word.bbox[0][1]
  const width = word.bbox[1][0] - word.bbox[0][0]

  return <Link href={`${baseUrl}/${word.id}`} data-lang={word.lang} className='relative flex-shrink-0 inline-flex items-stretch py-1 px-4 text-xl font-semibold text-gray-600 border-2 rounded-sm border-b-8 data-[lang=en]:border-b-green-300 data-[lang=ar]:border-b-blue-300'>
    {/* <Image height={height} width={width} src={`/api/images/${word.page}/${word.section}/${word.line_index}/${word.index}`} className='max-h-[27px] w-auto' alt="word" /> */}
    <span className="font-amiri text-xl">{word.text}</span>
    <span className='inline-flex items-center'>
      <span className='ml-2 px-2 py-0.5 rounded-lg  right-0 leading-3 text-[0.7rem] bg-gray-900 text-white'>{word.text_accuracy.toFixed(2)}</span>
    </span>
  </Link>
}
