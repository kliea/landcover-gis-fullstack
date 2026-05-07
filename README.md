# LandCover GIS Project

Frontend GIS web application built with React, Vite, and OpenLayers.  
The app consumes map services directly from a local GeoServer instance.

## Architecture

This repository is organized into two top-level folders:

- `frontend/` contains the React + Vite map client.
- `backend/geodjango_sample/` contains the Django + GeoDjango API project.
- `backend/ph_muni.sql` contains the municipality seed SQL for PostGIS.

Frontend app structure:

- `frontend/index.html` loads the app entry module.
- `frontend/src/main.jsx` mounts React into the DOM.
- `frontend/src/App.jsx` defines top-level page sections and composition.
- `frontend/src/pages/layouts/HooksWrapper.jsx` provides shared map state/actions through context.
- `frontend/src/hooks/useMaps.js` contains map initialization, layer setup, and GeoServer/Django API requests.
- `frontend/src/pages/Maps.jsx` renders map UI controls and binds to hook/context actions.

### Runtime Flow

1. User interacts with map controls in `Maps`.
2. Controls call actions from `useMaps` via `HooksWrapper` context.
3. `useMaps` sends requests to GeoServer:
   - WMS for tiled display layers
   - WFS for feature queries and filtering
4. Returned GeoJSON/features update map overlays and UI labels.

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (or compatible version that supports this lockfile)
- A running GeoServer instance on `http://localhost:8080`
- GeoServer workspace and layers configured as described below

## Local Development

Install dependencies:

```bash
cd frontend
npm install
```

Start development server:

```bash
cd frontend
npm run dev
```

Other scripts:

```bash
cd frontend
npm run build
npm run preview
npm run lint
```

## GeoServer Layer Expectations

The app currently expects GeoServer to expose the following workspace and layer names exactly:

- Workspace: `ITE-18-WEBGIS`
- WMS endpoint: `http://localhost:8080/geoserver/ITE-18-WEBGIS/wms`
- WFS endpoint: `http://localhost:8080/geoserver/ITE-18-WEBGIS/ows`
- Required layers:
  - `ITE-18-WEBGIS:PH_MUNI`
  - `ITE-18-WEBGIS:LandCover_w84`

### Required Attribute Fields

`useMaps` relies on these fields in service responses:

- `PH_MUNI`:
  - `Reg_Name`
  - `Pro_Name`
  - `the_geom`
- `LandCover_w84`:
  - `DESCRIPT`

If names differ in GeoServer (workspace, layer, or field names), app queries will fail or return empty results.

## Known Configuration Notes

- GeoServer URLs are currently hardcoded in `src/hooks/useMaps.js`.
- A Bing Maps key is currently embedded in `src/hooks/useMaps.js`.

For production-ready use, move endpoints and keys into environment variables.
