import * as React from 'react';

const Svg = (props) => {
  return (
    <svg
      id="download_svg__Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x={0}
      y={0}
      width={36}
      height={36}
      viewBox="-9.5 -9.5 36 36"
      xmlSpace="preserve"
      {...props}
    >
      <style>
        {
          '#download_svg__Layer_1:hover #download_svg__action{transform:translateY(-4px)}#download_svg__Layer_1:hover path{fill:#203457}'
        }
      </style>
      <path
        d="M17.3,11.1c-0.5,0-0.9,0.4-0.9,0.9l0,0v2.8c0,0.5-0.4,0.9-0.9,0.9H2.7c-0.5,0-0.9-0.4-0.9-0.9V12
	c0-0.5-0.4-0.9-0.9-0.9l0,0C0.4,11.1,0,11.5,0,12l0,0v2.8c0,1.5,1.2,2.7,2.7,2.7l0,0h12.9c1.5,0,2.7-1.2,2.7-2.7l0,0V12
	C18.2,11.5,17.8,11.1,17.3,11.1C17.4,11.1,17.3,11.1,17.3,11.1z"
        fill="#555"
      />
      <path
        style={{
          transition: 'all .3s ease',
        }}
        id="download_svg__action"
        d="M8.3,0.8v10.1L4.8,7.5C4.5,7.2,4,7.2,3.7,7.5s-0.3,0.8,0,1.1l4.9,4.8c0.3,0.3,0.8,0.3,1.1,0l4.9-4.9
	c0.2-0.2,0.2-0.4,0.2-0.6c0-0.2-0.1-0.4-0.2-0.6c-0.3-0.3-0.8-0.3-1.1,0L10,10.8v-10C9.9,0.4,9.5,0,9.1,0l0,0C8.7,0,8.3,0.4,8.3,0.8
	z"
        fill="#555"
      />
    </svg>
  );
};

export default Svg;
