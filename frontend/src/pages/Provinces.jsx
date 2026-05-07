import React from 'react';
import Container from './layouts/Container';
import Carousel from '../components/Carousel';
import SurigaoSur from '../assets/Surigaodelsur.png';
import Agusandelsur from '../assets/Agusandelsur.png';
import Agusandelnorte from '../assets/Agusandelnorte.png';
import Dinagat from '../assets/Dinagat.png';
import Surigaodelnorte from '../assets/Surigaodelnorte.png';
export default function Provinces() {
	const cardData = [
		{
			name: 'AGUSAN DEL NORTE',
			description:
				'This region is rich with mosaic of land uses, including extensive agriculture, significant natural vegetation, and water features, interspersed with human settlements and potentially industrial or extractive activities.',
			image: Agusandelnorte,
		},
		{
			name: 'AGUSAN DEL SUR',
			description:
				'This region exhibits a complex tapestry of land uses, where natural features such as forests, water bodies, and wetlands are interspersed with human-driven landscapes like agriculture, urban development, and possibly extractive industries. ',
			image: Agusandelsur,
		},
		{
			name: 'DINAGAT ISLANDS',
			description:
				'This region has a balanced distribution of land cover types, including productive agricultural lands, significant forested areas, and a variety of water bodies, all interspersed with human settlements. The presence of wetlands and potential mangrove zones indicates ecological diversity, particularly in coastal areas, which might be key for environmental conservation efforts.',
			image: Dinagat,
		},
		{
			name: 'SURIGAO DEL NORTE',
			description:
				'This region boasts a variety of natural landscapes like forests, grasslands, and various types of water bodies, juxtaposed with human-utilized agricultural land. The presence of wetlands and potential mangrove forests, especially along the coastlines and the islands, suggests a rich ecological tapestry. Such areas are likely to be of high conservation value, providing critical services such as habitat for wildlife, storm protection, and water purification.',
			image: Surigaodelnorte,
		},
		{
			name: 'SURIGAO DEL SUR',
			description:
				'This region has a rich array of natural habitats, from agricultural land to diverse forest types and aquatic ecosystems. The mix of these environments suggests a potential for a wide range of biodiversity and ecological services, as well as a landscape that supports various forms of land use by humans.',
			image: SurigaoSur,
		},
	];

	return (
		<Container id='Provinces'>
			<div className='h-full w-full bg-[#2F5025]'>
				<div className='h-full w-full flex flex-col p-4 justify-center gap-10 '>
					<h1
						className=' text-5xl pl-20 font-bold text-[#EDF5E1] drop-shadow-xl'
						style={{ textShadow: ' 3px 6px 3px rgba(0,0,0, 0.5)' }}>
						The 5 Provinces of CARAGA
					</h1>
					<Carousel cards={cardData} />
				</div>
			</div>
		</Container>
	);
}
