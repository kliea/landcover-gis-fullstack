import React, { useState, useContext } from 'react';
import { CustomHookContext } from '../pages/layouts/HooksWrapper';
import { Link } from 'react-scroll';

export default function Carousel({ cards }) {
	const [activeIndex, setActiveIndex] = useState(0);

	const handlePrev = () => {
		setActiveIndex((prevIndex) =>
			prevIndex === 0 ? cards.length - 1 : prevIndex - 1
		);
	};

	const handleNext = () => {
		setActiveIndex((prevIndex) =>
			prevIndex === cards.length - 1 ? 0 : prevIndex + 1
		);
	};

	const { handleClick } = useContext(CustomHookContext);

	return (
		<div className='relative w-5/6 h-2/3 mx-auto'>
			<div className='h-full w-full flex overflow-hidden'>
				{cards.map((card, index) => (
					<div
						key={card.name}
						className={`w-full h-full flex-shrink-0 transition-opacity duration-500 ease-in-out ${
							index === activeIndex ? 'opacity-100' : 'opacity-0'
						}`}
						style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
						<div className='flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden w-full h-full'>
							<div className='w-1/2 h-full bg-black overflow-hidden'>
								<img
									className='object-cover w-full h-full'
									src={card.image}
									alt={card.name}
								/>
							</div>
							<div className='w-1/2 h-full p-14 pr-20 flex flex-col items-center gap-10'>
								<h5 className='self-center text-5xl font-bold text-[#0c0c0c]'>
									{card.name}
								</h5>
								<p className='text-gray-700 text-3xl text-justify'>{card.description}</p>
							</div>
						</div>
						<button className='absolute left-[20rem] bottom-5 bg-[#549969] p-3 rounded-full font-bold w-[130px] text-lg text-white hover:bg-[#FFA500]'>
							<Link to='Maps' onClick={() => handleClick(card.name)}>
								Navigate
							</Link>
						</button>
					</div>
				))}
			</div>
			<button
				onClick={handlePrev}
				className='absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-[#CC5500]  rounded-full p-3 m-4 hover:bg-[#FAD7A0] focus:outline-none'>
				‹
			</button>
			<button
				onClick={handleNext}
				className='absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-[#CC5500]  rounded-full p-3 m-4 hover:bg-[#FAD7A0] focus:outline-none'>
				›
			</button>

			<div className='absolute bottom-0 w-full flex justify-center p-4'>
				{cards.map((_, index) => (
					<button
						key={index}
						className={`h-2 w-2 rounded-full mx-1 ${
							index === activeIndex ? 'bg-orange-500' : 'bg-gray-500'
						}`}
						onClick={() => setActiveIndex(index)}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
}
