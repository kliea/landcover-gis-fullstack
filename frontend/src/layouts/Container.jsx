import React from 'react';

export default function Container({ children, id }) {
	return (
		<section id={id}>
			<div className='h-screen w-full flex flex-col pt-28 bg-[#ECDED5]'>
				{children}
			</div>
		</section>
	);
}
