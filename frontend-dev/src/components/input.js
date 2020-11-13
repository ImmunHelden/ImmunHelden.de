import React from 'react'

export default function Input({ type = 'text', placeholder, onInput = () => {} }) {
  return (
    <div className="">
      {
        type === 'textarea' 
          ? <textarea 
            className="bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 rounded-xl px-6 py-5 text-lg w-full transition-colors duration-150 border-2 border-transparent focus:border-gray-400 font-medium" 
            style={{ outline: 'none' }} 
            rows="6" 
            placeholder={placeholder} 
            onInput={e => onInput(e.target.value)}></textarea>
          : <input 
              type={type} 
              className="bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 rounded-xl px-6 py-5 text-lg w-full transition-colors duration-150 border-2 border-transparent focus:border-gray-400 font-medium" 
              style={{ outline: 'none' }} 
              placeholder={placeholder} 
              onInput={e => onInput(e.target.value)} />
      }
    </div>
  )
}