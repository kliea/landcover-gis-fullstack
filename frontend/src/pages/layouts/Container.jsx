import React from 'react';

export default function Container({ id, color, children }) {
	return (
		<section id={id} className={color}>
			<div className='flex flex-col h-screen '>
				{children}
			</div>
		</section>
	);
}
