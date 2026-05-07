import React, { useEffect, useRef, useState } from 'react'; // react hooks
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import { fromLonLat, toLonLat } from 'ol/proj';
import FullScreen from 'ol/control/FullScreen.js';
import MousePosition from 'ol/control/MousePosition.js';
import { createStringXY } from 'ol/coordinate.js';
import { ScaleLine } from 'ol/control.js';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorSource from 'ol/source/Vector';
import VectorTileSource from 'ol/source/VectorTile';
import GeoJSON from 'ol/format/GeoJSON';
import MVT from 'ol/format/MVT';
import LayerSwitcher from 'ol-layerswitcher';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import { landCoverStyle, muniStyle } from '../utils/mapStyles';
import {
	LANDCOVER_TILE_URL,
	MUNI_TILE_URL,
	getLandCover,
	getMunicipalityByPoint,
	getProvinceGeometry,
	getProvinces,
	getRegions,
} from '../services/municipalityApi';

const useMaps = () => {
	const mapRef = useRef(null);
	const mapContainerRef = useRef(null);
	const mousePositionRef = useRef(null);
	const scaleLineRef = useRef(null);
	const [descript, setDescript] = useState('');
	const [province, setProvince] = useState('');
	const [featureInfoTriggered, setFeatureInfoTriggered] = useState(false);
	const [provinceQueryTriggered, setProvinceQueryTriggered] = useState(false);
	const [regions, setRegions] = useState([]);
	const [selectedRegion, setSelectedRegion] = useState('');
	const [provinces, setProvinces] = useState([]);
	const [selectedProvince, setSelectedProvince] = useState('');
	const [showMunicipality, setShowMunicipality] = useState(false);
	const [showLandCover, setShowLandCover] = useState(false);
	const [layersVisible, setLayersVisible] = useState(false);
	const [tilesVisible, setTilesVisible] = useState(false);
	const muniSourceRef = useRef(new VectorSource());
	const landCoverSourceRef = useRef(new VectorSource());
	const municipalityLayerRef = useRef(null);
	const landCoverLayerRef = useRef(null);
	const muniTileLayerRef = useRef(null);
	const lcTileLayerRef = useRef(null);

	useEffect(() => {
		if (!mapRef.current) {
			initializeMap();
		}

		const handleSingleClick = (e) => {
			if (featureInfoTriggered) {
				fetchFeatureInfo(e);
			}
		};

		mapRef.current.on('singleclick', handleSingleClick);

		return () => {
			mapRef.current?.un('singleclick', handleSingleClick);
		};
	}, [featureInfoTriggered]);

	const initializeMap = () => {
		const mapView = new View({
			center: fromLonLat([125.5978, 8.9553]),
			zoom: 10,
		});

		const fs = new FullScreen({
			target: 'fullscreen',
		});

		const mp = new MousePosition({
			coordinateFormat: createStringXY(4),
			projection: 'EPSG:4326',
			target: mousePositionRef.current,
		});

		const scale = new ScaleLine({
			units: 'metric',
			target: scaleLineRef.current,
		});

		var layerSwitcher = new LayerSwitcher({
			activationMode: 'click',
			startActive: false,
			groupSelectStyle: 'children',
		});

		const municipalityLayer = new VectorLayer({
			title: 'Municipality (Province)',
			source: muniSourceRef.current,
			zIndex: 20,
			visible: false,
			style: muniStyle,
		});

		const landCoverLayer = new VectorLayer({
			title: 'LandCover (Province)',
			source: landCoverSourceRef.current,
			zIndex: 10,
			visible: false,
			style: landCoverStyle,
		});

		muniTileLayerRef.current = new VectorTileLayer({
			title: 'PH Municipalities (National)',
			source: new VectorTileSource({
				format: new MVT(),
				url: MUNI_TILE_URL,
			}),
			style: muniStyle,
			zIndex: 15,
			visible: false,
		});

		lcTileLayerRef.current = new VectorTileLayer({
			title: 'Land Cover (National)',
			source: new VectorTileSource({
				format: new MVT(),
				url: LANDCOVER_TILE_URL,
			}),
			style: landCoverStyle,
			zIndex: 12,
			visible: false,
		});

		municipalityLayerRef.current = municipalityLayer;
		landCoverLayerRef.current = landCoverLayer;

		mapRef.current = new Map({
			target: mapContainerRef.current,
			view: mapView,
			controls: [fs, mp, scale, layerSwitcher],
			layers: [
				new TileLayer({
					title: 'OpenStreetMap',
					type: 'base',
					visible: true,
					source: new OSM(),
				}),
				lcTileLayerRef.current,
				muniTileLayerRef.current,
				municipalityLayer,
				landCoverLayer,
			],
		});

		console.log('Map initialized, target div:', document.getElementById('map'));
		console.log(
			'Map div height:',
			document.getElementById('map')?.offsetHeight
		);
		const layers = mapRef.current.getLayers().getArray();
		console.log('Muni layer:', layers);
		console.log(
			'Layer titles:',
			layers.map((l) => l.get('title'))
		);
	};

	const loadProvinceLayer = async (provinceName) => {
		console.log('1. loadProvinceLayer called with:', provinceName);

		const geojson = await getProvinceGeometry(provinceName);
		console.log('2. GeoJSON received:', JSON.stringify(geojson).slice(0, 200));
		console.log('3. Feature count:', geojson?.features?.length);
		const format = new GeoJSON();
		muniSourceRef.current.clear();

		const features = format.readFeatures(geojson, {
			featureProjection: 'EPSG:3857',
		});
		console.log('4. Features parsed by OL:', features.length);

		muniSourceRef.current.addFeatures(features);
		console.log('5. Source extent:', muniSourceRef.current.getExtent());
		console.log('6. Source empty?', muniSourceRef.current.isEmpty());

		if (!muniSourceRef.current.isEmpty()) {
			mapRef.current.getView().fit(muniSourceRef.current.getExtent(), {
				padding: [40, 40, 40, 40],
				maxZoom: 14,
			});
			console.log('7. View fitted to extent');
		} else {
			console.warn('7. Source is empty - no fit performed');
		}
	};

	const loadLandCover = async (provinceName) => {
		const geojson = await getLandCover(provinceName);
		const format = new GeoJSON();
		landCoverSourceRef.current.clear();
		const lcFeatures = format.readFeatures(geojson, {
			featureProjection: 'EPSG:3857',
			dataProjection: 'EPSG:4326',
		});
		landCoverSourceRef.current.addFeatures(lcFeatures);
		console.log('LandCover GeoJSON count:', geojson?.features?.length || 0);
		console.log('LandCover parsed features:', lcFeatures.length);
		console.log(
			'LandCover first classname:',
			geojson?.features?.[0]?.properties?.classname || '(none)'
		);
	};

	const fetchFeatureInfo = async (e) => {
		try {
			const [lon, lat] = toLonLat(e.coordinate);
			const municipalityResp = await getMunicipalityByPoint(lon, lat);

			if (municipalityResp?.result?.pro_name) {
				setProvince(municipalityResp.result.pro_name);
				const landCoverResp = await getLandCover(
					municipalityResp.result.pro_name
				);
				const firstFeature = landCoverResp?.features?.[0];
				setDescript(
					firstFeature?.properties?.descript ||
						firstFeature?.properties?.classname ||
						''
				);
			}
		} catch (error) {
			console.error('Error fetching the data:', error);
		}
	};

	const handleInfoScan = () => {
		setProvinceQueryTriggered(false);
		setFeatureInfoTriggered((prev) => !prev);
	};

	const handleQueryScan = () => {
		setDescript('');
		setProvinceQueryTriggered((prev) => !prev);
	};

	const zoomIn = () => {
		let currentZoom = mapRef.current.getView().getZoom();
		mapRef.current.getView().setZoom(currentZoom + 1);
	};

	const zoomOut = () => {
		let currentZoom = mapRef.current.getView().getZoom();
		mapRef.current.getView().setZoom(currentZoom - 1);
	};

	const fetchRegionsData = async (setRegions) => {
		try {
			const data = await getRegions();
			setRegions((data.results || []).map((row) => row.reg_name));
		} catch (error) {
			console.error('Error fetching regions:', error);
		}
	};

	const fetchProvincesData = async (selectedRegion, setProvinces) => {
		try {
			const data = await getProvinces(selectedRegion);
			setProvinces((data.results || []).map((row) => row.pro_name));
		} catch (error) {
			console.error('Error fetching provinces:', error);
		}
	};

	useEffect(() => {
		fetchRegionsData(setRegions);
		if (selectedRegion) {
			fetchProvincesData(selectedRegion, setProvinces);
		}
	}, [selectedRegion]);

	const handleSubmit = async (provinceName) => {
		const provinceToLoad = provinceName || selectedProvince;
		console.log('handleSubmit; province:', provinceToLoad);
		if (!provinceToLoad) return;
		muniTileLayerRef.current?.setVisible(false);
		lcTileLayerRef.current?.setVisible(false);
		setTilesVisible(false);
		setLayersVisible(false);
		await loadProvinceLayer(provinceToLoad);
		await loadLandCover(provinceToLoad);
		municipalityLayerRef.current?.setVisible(true);
		landCoverLayerRef.current?.setVisible(true);
		setShowMunicipality(true);
		setShowLandCover(true);
	};
	const handleClick = async (name) => {
		muniTileLayerRef.current?.setVisible(false);
		lcTileLayerRef.current?.setVisible(false);
		setTilesVisible(false);
		setLayersVisible(false);
		await loadProvinceLayer(name);
		await loadLandCover(name);
		municipalityLayerRef.current?.setVisible(true);
		landCoverLayerRef.current?.setVisible(true);
		setShowMunicipality(true);
		setShowLandCover(true);
	};

	const toggleAllLayers = () => {
		const show = !tilesVisible;
		muniTileLayerRef.current?.setVisible(show);
		lcTileLayerRef.current?.setVisible(show);

		if (show) {
			muniSourceRef.current.clear();
			landCoverSourceRef.current.clear();
			municipalityLayerRef.current?.setVisible(false);
			landCoverLayerRef.current?.setVisible(false);
			setShowMunicipality(true);
			setShowLandCover(true);
			mapRef.current?.getView().animate({
				center: fromLonLat([122.0, 12.0]),
				zoom: 6,
				duration: 800,
			});
		} else {
			setShowMunicipality(false);
			setShowLandCover(false);
		}

		setTilesVisible(show);
		setLayersVisible(show);
	};

	const toggleMunicipalityLayer = () => {
		const next = !showMunicipality;
		setShowMunicipality(next);
		municipalityLayerRef.current?.setVisible(next);
		muniTileLayerRef.current?.setVisible(next && tilesVisible);
	};

	const toggleLandCoverLayer = () => {
		const next = !showLandCover;
		setShowLandCover(next);
		landCoverLayerRef.current?.setVisible(next);
		lcTileLayerRef.current?.setVisible(next && tilesVisible);
	};

	const refreshMapSize = () => {
		if (mapRef.current) {
			mapRef.current.updateSize();
		}
	};

	useEffect(() => {
		if (provinceQueryTriggered && selectedProvince) {
			handleSubmit(selectedProvince);
		}
	}, [provinceQueryTriggered, selectedProvince]);

	return {
		mapRef: mapContainerRef,
		mousePositionRef,
		scaleLineRef,
		descript,
		province,
		featureInfoTriggered,
		provinceQueryTriggered,
		regions,
		selectedRegion,
		setSelectedRegion,
		provinces,
		selectedProvince,
		setSelectedProvince,
		showMunicipality,
		showLandCover,
		layersVisible,
		handleInfoScan,
		handleQueryScan,
		zoomIn,
		zoomOut,
		handleSubmit,
		handleClick,
		toggleAllLayers,
		toggleMunicipalityLayer,
		toggleLandCoverLayer,
		refreshMapSize,
	};
};

export default useMaps;
