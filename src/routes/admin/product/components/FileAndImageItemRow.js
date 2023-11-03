import { Tooltip } from 'antd';
import React from 'react'

const FileAndImageItemRow = ({ index, photo, handleDeleteItem }) => {
  return (
    <div className="flex justify-between items-center h-9" key={index}>
      <li className='truncate w-[80%]'>
        <a href={photo} target="_blank" rel="noreferrer" className="text-blue-500 underline">
          <Tooltip title={photo?.split('/')?.reverse()[0]}> {photo?.split('/')?.reverse()[0]}</Tooltip>
        </a>
      </li>
      <button onClick={handleDeleteItem} className="">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.60938 0.890625L0.890625 1.60938L5.28125 6L0.890625 10.3906L1.60938 11.1094L6 6.71875L10.3906 11.1094L11.1094 10.3906L6.71875 6L11.1094 1.60938L10.3906 0.890625L6 5.28125L1.60938 0.890625Z"
            fill="#EF4444"
          />
        </svg>
      </button>
    </div>
  )
}

export default FileAndImageItemRow
