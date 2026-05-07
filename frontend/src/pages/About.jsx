import React from 'react';
import Container from './layouts/Container';
import image_Armiex from '../assets/team/armiex.jpg';
import image_Dino from '../assets/team/dino.jpg';
import image_Fritzie from '../assets/team/fritzie.jpg';
import image_Gio from '../assets/team/gio.jpg';
import image_Jeric from '../assets/team/jeric.jpg';
import image_Junward from '../assets/team/junward.jpg';
import image_Klinth from '../assets/team/klinth.jpg';
import ProfileCarousel from '../components/ProfileCarousel';

export default function About() {
	const profile_data = [
		{
			name: 'Klinth Jerald Matugas',
			job: 'Developer',
			link: 'https://web.facebook.com/daqtelyen',
			image: image_Klinth,
		},
		{
			name: 'Fritzie Nuñez',
			job: 'Developer',
			link: 'https://web.facebook.com/pran.fritzie',
			image: image_Fritzie,
		},
		{
			name: 'Armiex Roble',
			job: 'Developer',
			link: 'https://web.facebook.com/armiexjay.roble.7',
			image: image_Armiex,
		},
		{
			name: 'Dino Rey Barliso',
			job: 'Developer',
			link: 'https://web.facebook.com/Dr.Zania',
			image: image_Dino,
		},
		{
			name: 'Gio Gonzales',
			job: 'Developer',
			link: 'https://web.facebook.com/hackerGioo',
			image: image_Gio,
		},
		{
			name: 'Jeric Bonilla',
			job: 'Developer',
			link: 'https://web.facebook.com/akusijeric',
			image: image_Jeric,
		},
		{
			name: 'Junward Megullas',
			job: 'Developer',
			link: 'https://web.facebook.com/junward.megullas.3',
			image: image_Junward,
		},
	];
	return (
		<Container id='About'>
			<div className='h-screen w-full bg-[#2F5025]'>
				<div className='h-full w-full flex flex-col pt-32 p-4 '>
					<ProfileCarousel cards={profile_data} />
				</div>
			</div>
		</Container>
	);
}
