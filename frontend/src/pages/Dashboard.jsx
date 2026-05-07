import React, { useEffect, useState } from 'react';
import Background from '../assets/background.jpg';
import Container from './layouts/Container';
import Button from '../components/Button';

export default function Dashboard() {
	const words = ['Discover', 'Navigate'];
	const [wordIndex, setWordIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setWordIndex((prev) => (prev + 1) % words.length);
		}, 1500);
		return () => clearInterval(interval);
	}, [words.length]);

	return (
		<Container id='Hero'>
			<div
				className='h-full w-full bg-black/75'
				style={{ backgroundImage: `url(${Background})` }}>
				<div className='h-full w-full bg-black/80'>
					<div className='h-full w-full  flex flex-col pt-40 pl-20 drop-shadow-md'>
						<h3
							className='text-[#EDF5E1] font-bold text-5xl pb-5 flex gap-2'
							style={{ textShadow: ' 3px 6px 3px rgba(0,0,0, 0.1)' }}>
							{' '}
							We
							<span className='text-[#ffde59] '>
								{words[wordIndex]}
							</span>
						</h3>

						<div
							className='text-[green] text-4xl font-sans font-extrabold'
							style={{ textShadow: ' 3px 6px 3px rgba(0,0,0, 0.5)' }}>
							<h1>CARAGA STATE UNIVERSITY</h1>
							<p className='text-[90px] font-sans text-[#EDF5E1] leading-[7.5rem]'>
								The
								<br />
								Philippines'
								<br />
								<span className='text-[#549969]'>Land</span>{' '}
								<span className='text-[#ff9900]'>Cover</span>
							</p>
						</div>

						<button>
							<Button to='Maps'>
								<h1 className='bg-transparent border-[#549969]  border-2 p-3 font-bold w-[130px] text-lg text-[#549969] hover:bg-[#549969] hover:text-white '>
									Explore
								</h1>
							</Button>
						</button>
						<div className='text-white font-bold pt-20'>
							<h3>A WEB-GIS Project of ITE-18 GROUP 1</h3>
							<p>
								Caraga State University - Main, Ampayon, Butuan City, Agusan del
								Norte, Philippines
							</p>
						</div>
					</div>
				</div>
			</div>
		</Container>
	);
}
