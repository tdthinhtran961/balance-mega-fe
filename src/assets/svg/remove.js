import * as React from 'react';

const svg = (props) => {
  return (
    <svg
      id="remove_svg__Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x={0}
      y={0}
      width={30}
      height={30}
      viewBox="-9.5 -9.5 36 36"
      xmlSpace="preserve"
      {...props}
    >
      <style>
        {
          '#remove_svg__Layer_1:hover #remove_svg__action{transform:translateY(-3.2px) rotate(6deg) translateX(.5px)}#remove_svg__Layer_1:hover path{fill:#f64e60}'
        }
      </style>
      <g fill={555555}>
        <path
          id="remove_svg__action"
          d="M14.9,2.9h-3.7c-0.1-1.4-1.3-2.5-2.7-2.4C7.2,0.5,6.1,1.6,6,2.9H2.1c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7h12.7
		c0.4,0,0.7-0.3,0.7-0.7C15.6,3.3,15.2,2.9,14.9,2.9z M8.6,2c0.6,0,1.1,0.4,1.2,1H7.4C7.5,2.4,8,2,8.6,2z"
          style={{
            transition: 'all .3s ease',
          }}
        />
        <path
          d="M3,3.3v10.4c0,1.5,1.2,2.8,2.8,2.8h5.5c1.6,0,2.9-1.3,2.9-2.9V3.3H3z M12.8,13.7c0,0.8-0.6,1.4-1.4,1.4H5.8
		c-0.8,0-1.4-0.6-1.4-1.4V4.4h8.4V13.7z M6.2,13.1V6.4c0-0.4,0.3-0.7,0.7-0.7c0.4,0,0.7,0.3,0.7,0.7V13c0,0.4-0.3,0.8-0.7,0.8
		C6.5,13.8,6.2,13.5,6.2,13.1z M9.4,13.1V6.4c0-0.4,0.3-0.7,0.7-0.7c0.4,0,0.7,0.3,0.7,0.7V13c0,0.4-0.3,0.8-0.7,0.8
		C9.7,13.8,9.4,13.5,9.4,13.1z"
        />
      </g>
    </svg>
  );
};

export default svg;
