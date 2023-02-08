"use client"

import React, { Fragment, useEffect, useState } from 'react'

import classNames from '@/lib/classNames'

const mapKeyValues = (keyValues: any, size: number, keysRef: any[]) => {
  keyValues = Array.isArray(keyValues) ? keyValues : [keyValues]
  let values: boolean[] = Array(size).fill(false)
  let indexes: number[] = keyValues.map((k: any) => keysRef && keysRef.length ? keysRef.indexOf(k) : k)
  indexes.forEach(i => values[i] = true)
  return values
}

export default function ListChoice({ className, children, minSelect, maxSelect, keys, onChange, defaultValue, value }: any) {
  children = Array.isArray(children) ? children : [children]
  
  const [values, setValues] = useState<boolean[]>(()=>{
    let v = defaultValue || value
    if(v) {
      v = mapKeyValues(v, children.length, keys)
    } else if(!v) {
      v = Array(children.length).fill(false)
    }
    return v
  })
  minSelect = minSelect || 0
  maxSelect = maxSelect || children.length

  const validateMin = (minSelect: number, newState: boolean[]) => {
    let count = newState.reduce((total, current) => total + Number(current), 0)
    return count >= minSelect
  }

  const validateMax = (maxSelect: number, newState: boolean[]) => {
    let count = newState.reduce((total, current) => total + Number(current), 0)
    return count <= maxSelect
  }

  const calculateState = (state: boolean[], index: number, minSelect: number, maxSelect: number): boolean[] => {
    let newState = state
    if(maxSelect === 1) {
      newState = state.map((v, i) => i == index ? !state[i] : false)
    } else {
      newState = state.map((v, i) => i == index ? !state[i] : state[i])
    }
    return newState
  }

  const choiceClick = (index: number) => {
    const newState = calculateState(values, index, minSelect, maxSelect)
    if(validateMax(maxSelect, newState) && validateMin(minSelect, newState)) {
      setValues(newState)
      if(onChange) {
        let mappedValues = newState.map((v, i) => i).filter((v,i) => newState[v]).map((v) => keys && keys.length ? keys[v] : v)
        onChange(maxSelect == 1 ? mappedValues[0] : mappedValues)
      }
    }
  }

  useEffect(()=>{
    setValues(mapKeyValues(value, children.length, keys))
  }, [value, children.length, keys])

  return <div className={className}>
    {children.map((child: any, index: number) => <Fragment key={index}>
        { typeof(child) === "function" ? child(values[index], choiceClick) : child }
      </Fragment>
    )}
  </div>
}

export function PillToggle({ children, ...props }: any) {
  children = Array.isArray(children) ? children : [children]
  return <ListChoice {...props} className="flex">
    {(active: boolean, choiceClick: (index: number)=>null) => <button
      onClick={choiceClick.bind(null, 0)}
      className={classNames(
        'bg-yellow-300 p-2 rounded-l-xl outline-offset-2 outline-yellow-300',
        active ? 'outline' : ''
        )}
      style={{clipPath: 'inset(-10px 0px -10px -10px)'}}
    >
      { typeof(children[0]) === "function" ? children[0](active) : children[0] }
    </button>}
    {(active: boolean, choiceClick: (index: number)=>null) => <button
      onClick={choiceClick.bind(null, 1)}
      className={classNames(
        'bg-green-300 p-2 rounded-r-xl outline-offset-2 outline-green-300',
        active ? 'outline' : ''
        )}
        style={{clipPath: 'inset(-10px -10px -10px 0px)'}}
    >
      { typeof(children[1]) === "function" ? children[1](active) : children[1] }
    </button>}
  </ListChoice>
}

export function ButtonToggle({ children, ...props }: any) {
  children = Array.isArray(children) ? children : [children]
  return <ListChoice {...props} className="flex-shrink-0 flex flex-row h-12 w-32 items-stretch gap-4 p-1">
    {(active: boolean, choiceClick: (index: number)=>null) => <button
      className={classNames(
        active ? "bg-gray-800 text-white" : "bg-white text-gray-800",
        "flex-1 outline rounded-lg outline-offset-2 outline-2 outline-gray-800 flex justify-center items-center"
      )}
      onClick={choiceClick.bind(null, 0)}
    >
      { typeof(children[0]) === "function" ? children[0](active) : children[0] }
    </button>}
    {(active: boolean, choiceClick: (index: number)=>null) => <button
      className={classNames(
        active ? "bg-gray-800 text-white" : "bg-white text-gray-800",
        "flex-1 outline rounded-lg outline-offset-2 outline-2 outline-gray-800 flex justify-center items-center"
      )}
      onClick={choiceClick.bind(null, 1)}
    >
      { typeof(children[1]) === "function" ? children[1](active) : children[1] }
    </button>}
  </ListChoice>
}