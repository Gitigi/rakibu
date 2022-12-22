"use client"
import { useRef } from 'react'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from "react-window-infinite-loader";

import Image from 'next/image'

function Word({ index, style }: any) {
  console.log(style)
  return <div >
    <div style={style} className='relative inline-flex items-stretch py-1 px-4 text-xl font-semibold text-gray-600 border-2 rounded-sm border-b-8 border-b-blue-300'>
      Amini
      <span className='inline-flex items-center'>
        <span className='relative ml-2 px-2 py-0.5 rounded-lg  right-0 leading-3 text-[0.7rem] bg-gray-900 text-white'>70%</span>
      </span>
    </div>
    </div>
}

function Line({children, style}: any) {
  return <div style={style}>
    <div className='flex flex-row justify-start items-start space-x-4'>
      {children}
    </div>
  </div>
}

function Row({ index, style, data }: any) {
  if(data.current[index] != 2)
    return <p style={style}>Loading...</p>
  
  return <Line style={style}>
    <div className='relative inline-flex items-stretch py-1 px-4 text-xl font-semibold text-gray-600 border-2 rounded-sm border-b-8 border-b-green-300'>
      Salama
      <span className='inline-flex items-center'>
        <span className='relative ml-2 px-2 py-0.5 rounded-lg  right-0 leading-3 text-[0.7rem] bg-gray-900 text-white'>80%</span>
      </span>
    </div>
    <div className='relative inline-flex items-stretch py-1 px-4 text-xl font-semibold text-gray-600 border-2 rounded-sm border-b-8 border-b-blue-300'>
      Amini
      <span className='inline-flex items-center'>
        <span className='relative ml-2 px-2 py-0.5 rounded-lg  right-0 leading-3 text-[0.7rem] bg-gray-900 text-white'>70%</span>
      </span>
    </div>
    <div className='relative inline-flex items-stretch py-1 px-4 text-xl font-semibold text-gray-600 border-2 rounded-sm border-b-8 border-b-blue-300'>
      <img src='/api/images' className='h-[27px]' alt="word" />
      <span className='inline-flex items-center'>
        <span className='relative ml-2 px-2 py-0.5 rounded-lg  right-0 leading-3 text-[0.7rem] bg-gray-900 text-white'>70%</span>
      </span>
    </div>
  </Line>
}

export default function Home() {
  const LOADING = 1;
  const LOADED = 2;
  const itemStatusMap = useRef<any>({});

  const isItemLoaded = (index: number) => !!itemStatusMap.current[index];
  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    for (let index: number = startIndex; index <= stopIndex; index++) {
      itemStatusMap.current[index] = LOADING;
    }
    return new Promise((resolve: (value: any) => void ) =>
      setTimeout(() => {
        for (let index = startIndex; index <= stopIndex; index++) {
          itemStatusMap.current[index] = LOADED;
        }
        resolve(null);
      }, 2500)
    );
  };

  return (
    <>
      <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
        {/* Start main area*/}
        <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
          <div className="relative h-full rounded-lg border-2 border-dashed border-gray-200" >
            
            <AutoSizer>
              {({height, width}:any) => (
                <InfiniteLoader
                  isItemLoaded={isItemLoaded}
                  itemCount={1000}
                  loadMoreItems={loadMoreItems}
                >
                  {({ onItemsRendered, ref }: any) => (
                    <List
                      className="List"
                      height={height}
                      itemCount={1000}
                      itemData={itemStatusMap}
                      itemSize={55}
                      onItemsRendered={onItemsRendered}
                      ref={ref}
                      width={width}
                    >
                      {Row}
                    </List>
                  )}
                  {/* <List height={height} itemCount={1000} itemSize={55} width={width}>
                    {Row}
                  </List> */}
                </InfiniteLoader>

              )}
            </AutoSizer>
          </div>
        </div>
        {/* End main area */}
      </main>
      <aside className="relative hidden w-96 flex-shrink-0 overflow-y-auto border-l border-gray-200 xl:flex xl:flex-col">
        {/* Start secondary column (hidden on smaller screens) */}
        <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
          <div className="h-full rounded-lg border-2 border-dashed border-gray-200" />
        </div>
        {/* End secondary column */}
      </aside>
    </>
  )
}
