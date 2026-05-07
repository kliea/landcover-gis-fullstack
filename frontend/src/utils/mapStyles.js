import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

// LandCover color map - keys match exact descript values from PostGIS.
export const LANDCOVER_COLORS = {
	' Arable land, crops mainly cereals and sugar': {
		fill: 'rgba(255, 220, 80, 0.65)',
		stroke: '#b8860b',
	},
	' Built-up Area': { fill: 'rgba(220, 80, 80, 0.65)', stroke: '#a03030' },
	' Closed canopy, mature trees covering > 50 percent': {
		fill: 'rgba(0, 90, 0, 0.70)',
		stroke: '#004d00',
	},
	' Coconut plantations': {
		fill: 'rgba(100, 180, 60, 0.65)',
		stroke: '#4a8c20',
	},
	' Coral Reef': { fill: 'rgba(255, 160, 100, 0.65)', stroke: '#cc6020' },
	' Crop land mixed with coconut plantation': {
		fill: 'rgba(200, 210, 80, 0.65)',
		stroke: '#909830',
	},
	' Crop land mixed with other plantation': {
		fill: 'rgba(180, 200, 80, 0.65)',
		stroke: '#808830',
	},
	' Cultivated Area mixed with brushland/grassland': {
		fill: 'rgba(210, 230, 100, 0.65)',
		stroke: '#98a840',
	},
	' Eroded area': { fill: 'rgba(190, 160, 120, 0.65)', stroke: '#907050' },
	' Fishponds derived from mangrove': {
		fill: 'rgba(80, 170, 180, 0.65)',
		stroke: '#308898',
	},
	' Grassland, grass covering > 70 percent': {
		fill: 'rgba(180, 230, 90, 0.65)',
		stroke: '#80a830',
	},
	' Lake': { fill: 'rgba(50, 120, 220, 0.70)', stroke: '#2050b0' },
	' Mangrove vegetation': {
		fill: 'rgba(0, 120, 90, 0.65)',
		stroke: '#005040',
	},
	' Marshy area and swamp': {
		fill: 'rgba(120, 200, 190, 0.65)',
		stroke: '#409890',
	},
	' Mossy forest': { fill: 'rgba(60, 130, 80, 0.65)', stroke: '#204830' },
	' Open canopy, mature trees covering < 50 percent': {
		fill: 'rgba(80, 160, 60, 0.65)',
		stroke: '#307820',
	},
	' Other barren land': {
		fill: 'rgba(200, 190, 160, 0.65)',
		stroke: '#909070',
	},
	' Other fishponds': {
		fill: 'rgba(100, 180, 200, 0.65)',
		stroke: '#4090a8',
	},
	' Other plantations': {
		fill: 'rgba(140, 190, 80, 0.65)',
		stroke: '#608830',
	},
	' Pine forest': { fill: 'rgba(40, 110, 60, 0.65)', stroke: '#185028' },
	' Quarry': { fill: 'rgba(160, 140, 120, 0.65)', stroke: '#706050' },
	' Riverbeds': { fill: 'rgba(180, 210, 230, 0.65)', stroke: '#7090a8' },
	' Siltation pattern in lake': {
		fill: 'rgba(180, 170, 120, 0.65)',
		stroke: '#807840',
	},
	' Unclassified': { fill: 'rgba(200, 200, 200, 0.50)', stroke: '#909090' },
	default: { fill: 'rgba(180, 180, 180, 0.40)', stroke: '#808080' },
};

export const landCoverStyle = (feature) => {
	const raw =
		feature.get('descript') || feature.get('classname') || feature.get('class') || '';
	const exact =
		LANDCOVER_COLORS[raw] ||
		LANDCOVER_COLORS[` ${raw}`] ||
		LANDCOVER_COLORS[raw.trim()];
	const colors = exact ?? LANDCOVER_COLORS.default;
	return new Style({
		stroke: new Stroke({ color: colors.stroke, width: 0.8 }),
		fill: new Fill({ color: colors.fill }),
	});
};

export const muniStyle = new Style({
	stroke: new Stroke({ color: '#555555', width: 0.5 }),
	fill: new Fill({ color: 'rgba(255, 255, 255, 0.0)' }),
});

export const provinceStyle = new Style({
	stroke: new Stroke({ color: '#ff6600', width: 2 }),
	fill: new Fill({ color: 'rgba(255, 102, 0, 0.08)' }),
});
