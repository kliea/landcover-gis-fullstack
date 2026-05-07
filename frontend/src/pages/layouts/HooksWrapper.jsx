import React, { createContext } from 'react';
import useMaps from '../../hooks/useMaps';

export const CustomHookContext = createContext(null);

export default function HooksWrapper({ children }) {
	const {
		mapRef,
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
		heatmapVisible,
		toggleHeatmap,
		pointFormOpen,
		setPointFormOpen,
		pendingCoord,
		setPendingCoord,
		handleAddPoint,
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
	} = useMaps();
	return (
		<CustomHookContext.Provider
			value={{
				mapRef,
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
				heatmapVisible,
				toggleHeatmap,
				pointFormOpen,
				setPointFormOpen,
				pendingCoord,
				setPendingCoord,
				handleAddPoint,
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
			}}>
			{children}
		</CustomHookContext.Provider>
	);
}
