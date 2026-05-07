import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Maps from './pages/Maps';
import About from './pages/About';
import Navbar from './components/Navbar';
import Provinces from './pages/Provinces';
import Home from './pages/Home';
import Footer from './components/Footer';

export default function App() {
	return (
		<main className='flex flex-col h-auto min-h-screen w-auto min-w-screen md:w-auto'>
			<Navbar />
			<Dashboard />
			<Home />
			<Provinces />
			<Maps />
			<About />
			<Footer />
		</main>
	);
}
