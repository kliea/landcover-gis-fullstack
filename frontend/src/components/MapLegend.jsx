import React from 'react';
import { LANDCOVER_COLORS } from '../utils/mapStyles';

export default function MapLegend({ visible }) {
	if (!visible) return null;

	return (
		<div className='absolute bottom-16 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 max-h-72 overflow-y-auto min-w-64'>
			<h3 className='font-bold text-xs mb-2 uppercase tracking-widest text-gray-600'>
				Land Cover Legend
			</h3>
			{Object.entries(LANDCOVER_COLORS)
				.filter(([key]) => key !== 'default')
				.map(([label, colors]) => (
					<div key={label} className='flex items-center gap-2 mb-1'>
						<div
							className='w-4 h-4 rounded-sm border flex-shrink-0'
							style={{
								backgroundColor: colors.fill,
								borderColor: colors.stroke,
								borderWidth: 1,
							}}
						/>
						<span className='text-xs text-gray-700 leading-tight'>
							{label.trim()}
						</span>
					</div>
				))}
		</div>
	);
}
