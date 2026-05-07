import React, { useState } from 'react';
import ph_img from '../assets/philippines1.png';
import '../assets/Styles/Home.css';

export default function Home() {
	const [toggleState, setToggleState] = useState(1);

	const toggleTab = (index) => {
		setToggleState(index);
	};

	return (
		<div className='home'>
			<div className='container'>
				<div className='btn-home'>
					<button
						className={toggleState === 1 ? 'tabs active-tabs' : 'tabs'}
						onClick={() => toggleTab(1)}>
						<span>Intro</span>
					</button>
					<button
						className={toggleState === 2 ? 'tabs active-tabs' : 'tabs'}
						onClick={() => toggleTab(2)}>
						<span>Mission</span>
					</button>
					<button
						className={toggleState === 3 ? 'tabs active-tabs' : 'tabs'}
						onClick={() => toggleTab(3)}>
						<span>History</span>
					</button>
				</div>
				<div className='ph_img'>
					<img src={ph_img} alt='Philippines Land Cover' />
				</div>
				<div className={toggleState === 1 ? 'intro active-intro' : 'intro'}>
					<h1>The Philippines</h1>
					<p>
						The Philippines, an archipelago consisting of over 7,000 islands in
						Southeast Asia, boasts a rich tapestry of diverse land covers. From
						lush tropical rainforests to pristine beaches, this tropical
						paradise offers a wide range of stunning natural landscapes. The
						country is home to dense forests teeming with biodiversity, rolling
						rice terraces that exemplify centuries-old agricultural traditions,
						and volcanic terrain that adds a touch of drama to its scenic
						beauty. Its coastal areas are fringed with white sandy shores and
						coral reefs, making it a haven for marine life. Explore the dynamic
						land covers of the Philippines, each contributing to the nation's
						unique and captivating charm.
					</p>
				</div>

				<div
					className={toggleState === 2 ? 'mission active-mission' : 'mission'}>
					<h1>Our Mission</h1>
					<p>
						Our school project offers an easy-to-use and visually appealing
						platform for students and educators. Our mission is clear: to
						inspire and educate by showcasing the diverse world of landcover. We
						want to connect people to nature, encouraging a love for the
						environment and active participation in conservation.
					</p>
				</div>
				<div
					className={toggleState === 3 ? 'history active-history' : 'history'}>
					<h1>History of our Land Cover</h1>
					<p>
						A group of passionate students and educators embarked on a project
						with a mission to inspire and educate by showcasing the diverse
						world of land cover. Through their dedicated efforts, they created
						an easy-to-use and visually appealing platform, bridging technology
						and nature. This initiative aimed to connect people to the
						environment, fostering a love for nature and encouraging active
						participation in conservation. The project quickly gained global
						recognition, becoming a living history of land cover and a catalyst
						for a worldwide community dedicated to preserving our planet.
					</p>
				</div>
			</div>
		</div>
	);
}
