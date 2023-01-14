"use client"

import React, { useEffect, useState } from 'react'

import classNames from '@/lib/classNames'

export default function BinaryToggle({ children, minSelect, maxSelect, keys, onChoice }: any) {
  const [values, setValues] = useState<boolean[]>([false, false])
  minSelect = minSelect || 0
  maxSelect = maxSelect || React.Children.count(children)

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
    console.log('clicked')
    setValues((state: boolean[]) => {
      const newState = calculateState(state, index, minSelect, maxSelect)
      if(validateMax(maxSelect, newState) && validateMin(minSelect, newState)) {
        return newState
      }
      return state
    })
  }

  useEffect(()=>{
    let mappedValues = values.map((v, i) => i).filter((v,i) => values[v]).map((v) => keys && keys[v] || v)
    if(onChoice) {
      onChoice(maxSelect == 1 ? mappedValues[0] : mappedValues)
    }
  }, [values])

  return <div className='flex'>
    <button onClick={choiceClick.bind(null, 0)}
      className={classNames(
        'bg-yellow-300 p-2 rounded-l-xl outline-offset-2 outline-yellow-300',
        values[0] ? 'outline' : ''
        )}
      style={{clipPath: 'inset(-10px 0px -10px -10px)'}}
    >
      { typeof(children[0]) === "function" ? children[0](values[0]) : children[0] }
    </button>
    <button onClick={choiceClick.bind(null, 1)}
      className={classNames(
        'bg-green-300 p-2 rounded-r-xl outline-offset-2 outline-green-300',
        values[1] ? 'outline' : ''
        )}
      style={{clipPath: 'inset(-10px -10px -10px 0px)'}}
    >
      { typeof(children[1]) === "function" ? children[1](values[1]) : children[1] }
    </button>
  </div>
}
