import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Profile({ name, job, link, image }) {
	return (
		<div className=' h-full w-full bg-black hover:bg-orange-500 '>
			<div className='h-full w-full text-black rounded-xl flex flex-col justify-center gap-20'>
				<div className='h-56 w-56 self-center overflow-hidden'>
					<img
						src={image}
						alt={name}
						className='object-cover w-full h-full rounded-full border-4 border-white'
					/>
				</div>
				<div className='flex flex-col justify-center items-center gap-2 text-slate-50'>
					<h2 className='font-bold text-3xl items-center '>{name}</h2>
					<p className='font-bold text-2xl '>{job}</p>
				</div>
				<div className='flex justify-center gap-4'>
					<a href={link}>
						<Facebook size={48} color='white' />
					</a>
					<Instagram size={48} color='white' />
					<Twitter size={48} color='white' />
				</div>
			</div>
		</div>
	);
}
