import React from 'react';
import Button from './Button';
import Logo from '../assets/Logo.png';

export default function Navbar() {
	return (
		<nav className='flex flex-row fixed top-0 z-50 pt-6 pb-5 bg-[#07110b] w-full justify-between px-2 sm:px-6 md:px-10'>
			<div className=''>
				<img src={Logo} className='h-20' />
			</div>
			<div className='hidden sm:flex gap-10 pr-10 text-white  font-bold'>
				<button>
					<Button to='Hero'>
						<h1 className='uppercase text-xl md:text-2xl hover:text-[#F09841] '>
							Dashboard
						</h1>
					</Button>
				</button>
				{/* <button>
					<Button to='Provinces'>
						<h1 className='uppercase text-xl md:text-2xl'>Provinces</h1>
					</Button>
				</button> */}
				<button>
					<Button to='Maps'>
						<h1 className='uppercase text-xl md:text-2xl hover:text-[#F09841] '>
							Map
						</h1>
					</Button>
				</button>
				<button>
					<Button to='About'>
						<h1 className='uppercase text-xl md:text-2xl hover:text-[#F09841] '>
							About
						</h1>
					</Button>
				</button>
			</div>
		</nav>
	);
}
