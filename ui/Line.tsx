export default function Line({children}: any) {
  return <div className='mb-2'>
    <div className='flex flex-row justify-start items-start space-x-4'>
      {children}
    </div>
  </div>
}
