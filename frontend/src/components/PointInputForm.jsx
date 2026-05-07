import React, { useState } from 'react';

export default function PointInputForm({ coord, onSubmit, onCancel }) {
	const [form, setForm] = useState({
		name: '',
		description: '',
		category: '',
		intensity: 1.0,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className='absolute top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-[2000] w-72'>
			<h3 className='font-bold text-sm uppercase tracking-wide mb-3'>
				Add Location Point
			</h3>

			{coord && (
				<p className='text-xs text-gray-500 mb-3'>
					{coord.lat.toFixed(5)}, {coord.lon.toFixed(5)}
				</p>
			)}

			<input
				name='name'
				placeholder='Name'
				value={form.name}
				onChange={handleChange}
				className='w-full border rounded px-2 py-1 text-sm mb-2'
			/>
			<input
				name='description'
				placeholder='Description'
				value={form.description}
				onChange={handleChange}
				className='w-full border rounded px-2 py-1 text-sm mb-2'
			/>
			<input
				name='category'
				placeholder='Category'
				value={form.category}
				onChange={handleChange}
				className='w-full border rounded px-2 py-1 text-sm mb-2'
			/>
			<div className='flex items-center gap-2 mb-3'>
				<label className='text-xs text-gray-600'>Intensity</label>
				<input
					name='intensity'
					type='range'
					min='0.1'
					max='1.0'
					step='0.1'
					value={form.intensity}
					onChange={handleChange}
					className='flex-1'
				/>
				<span className='text-xs w-6'>{form.intensity}</span>
			</div>

			<div className='flex gap-2'>
				<button
					onClick={() => onSubmit(form)}
					disabled={!coord || !form.name}
					className='flex-1 bg-green-700 text-white text-sm py-1 rounded disabled:opacity-40'>
					Save Point
				</button>
				<button
					onClick={onCancel}
					className='flex-1 bg-gray-200 text-sm py-1 rounded'>
					Cancel
				</button>
			</div>

			{!coord && (
				<p className='text-xs text-orange-500 mt-2'>
					Click on the map to set coordinates
				</p>
			)}
		</div>
	);
}
