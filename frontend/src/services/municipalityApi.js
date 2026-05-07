import { API_CONFIG } from './api.js';

const BASE = API_CONFIG.baseURL;

export const getRegions = () =>
	fetch(`${BASE}/api/regions/`).then((r) => r.json());

export const getProvinces = (regionName) =>
	fetch(
		`${BASE}/api/provinces/?region=${encodeURIComponent(regionName)}`
	).then((r) => r.json());

export const getProvinceGeometry = (provinceName) =>
	fetch(
		`${BASE}/api/provinces/${encodeURIComponent(provinceName)}/geometry/`
	).then((r) => r.json());

export const getMunicipalityByPoint = (lon, lat) =>
	fetch(`${BASE}/api/municipalities/by-point/?lon=${lon}&lat=${lat}`).then((r) =>
		r.json()
	);

export const getLandCover = (provinceName) =>
	fetch(`${BASE}/api/landcover/?province=${encodeURIComponent(provinceName)}`).then(
		(r) => r.json()
	);

export const getAllMunicipalities = () =>
	fetch(`${BASE}/api/municipalities/all/`).then((r) => r.json());

export const getAllLandCover = () =>
	fetch(`${BASE}/api/landcover/all/`).then((r) => r.json());

export const MUNI_TILE_URL = `${BASE}/api/tiles/municipalities/{z}/{x}/{y}/`;

export const LANDCOVER_TILE_URL = `${BASE}/api/tiles/landcover/{z}/{x}/{y}/`;
