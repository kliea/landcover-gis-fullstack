# LandCover GIS Project

Full-stack web GIS app for browsing Philippine municipality and land-cover
data. The backend is a Django + GeoDjango API backed by PostGIS; the
frontend is a React + Vite + OpenLayers map client that consumes the API
directly (no GeoServer required).

## Features

- National-scale browsing of municipalities and land cover via MVT
  vector tiles (`django-vectortiles`).
- Province query: pick a region + province and the map loads its
  municipalities and land cover and outlines the province border.
- Click-on-map feature info: returns the municipality, province, and
  dominant land-cover description for the clicked point.
- User-contributed location points with a toggleable heatmap layer
  (weighted by an `intensity` field).
- Side layer switcher (`ol-layerswitcher`) limited to the National
  tile layers and the OpenStreetMap base.

## Architecture

```
LandCoverGISProject/
├── backend/                         # Django + GeoDjango API
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/                      # Django project (settings, urls, wsgi)
│   ├── landcover/                   # Main app: models, views, serializers, urls, migrations
│   ├── tests/                       # pytest-django tests
│   ├── data/                        # Local-only GIS data (gitignored, see backend/data/README.md)
│   └── ph_muni.sql                  # Municipality seed SQL (gitignored)
└── frontend/                        # React + Vite + OpenLayers client
    ├── package.json
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── hooks/useMaps.js          # Map init, layer setup, API calls, state
        ├── pages/
        │   ├── Maps.jsx              # Map UI controls
        │   └── layouts/HooksWrapper.jsx  # Shares map state via context
        ├── components/PointInputForm.jsx # Form to add a location point
        ├── services/
        │   ├── api.js                # API base URL config
        │   └── municipalityApi.js    # Fetch helpers for the Django API
        └── utils/mapStyles.js        # OpenLayers styles for layers
```

### Runtime flow

1. The user interacts with controls in `Maps.jsx`.
2. Controls call actions exposed by `useMaps` through `HooksWrapper`'s
   React context.
3. `useMaps` calls the Django REST API (`services/municipalityApi.js`)
   for GeoJSON or hits the MVT tile endpoints directly from
   OpenLayers `VectorTileSource`s.
4. Returned features are styled (`utils/mapStyles.js`) and rendered as
   OpenLayers vector / vector-tile / heatmap layers.

## Tech stack

**Backend**

- Django 4.2 + Django REST Framework
- GeoDjango (`django.contrib.gis`) on PostgreSQL + PostGIS
- `djangorestframework-gis` for GeoJSON serialization
- `django-vectortiles` for MVT tile endpoints
- `django-cors-headers`, `python-dotenv`, `pytest` + `pytest-django`

**Frontend**

- React 18 + Vite 4
- OpenLayers 8 (`ol`) + `ol-layerswitcher`
- Tailwind CSS
- `lucide-react`, `react-router-dom`, `react-scroll`

## Prerequisites

- Python 3.11+ with GDAL / GEOS / PROJ available on your system
  (Windows users typically install OSGeo4W and point Django at it via
  the env vars below).
- PostgreSQL 14+ with the PostGIS extension enabled.
- Node.js 18+ and npm 9+.

## Backend setup (`backend/`)

1. Create the database and enable PostGIS:

   ```sql
   CREATE DATABASE landcover;
   \c landcover
   CREATE EXTENSION postgis;
   ```

2. Load the municipality seed and the land-cover dataset into PostGIS.
   The expected tables are:
   - `ph_muni` (Philippine municipalities, MultiPolygon SRID 4326)
   - `landcover_polygons` (land-cover polygons, MultiPolygon SRID 4326,
     attribute column `descript`)

   `ph_muni.sql` and the raw GIS files belong in `backend/` /
   `backend/data/` and are gitignored — see `backend/data/README.md`.

3. Create a virtual env and install dependencies:

   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate          # Windows
   # source .venv/bin/activate     # macOS/Linux
   pip install -r requirements.txt
   ```

4. Configure environment variables. Create `backend/.env`:

   ```env
   DJANGO_SECRET_KEY=change-me
   DJANGO_DEBUG=true
   DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

   DB_NAME=landcover
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432

   # Optional, only when GDAL/GEOS/PROJ are not auto-discovered
   GDAL_LIBRARY_PATH=C:\OSGeo4W\bin\gdal310.dll
   GEOS_LIBRARY_PATH=C:\OSGeo4W\bin\geos_c.dll
   PROJ_LIB=C:\OSGeo4W\share\proj
   ```

5. Apply migrations and run the dev server:

   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

   The API is then reachable at `http://127.0.0.1:8000/api/`.

### API endpoints

All endpoints are mounted under `/api/` (`backend/landcover/urls.py`):

| Method | Path                                            | Purpose                                                  |
| ------ | ----------------------------------------------- | -------------------------------------------------------- |
| GET    | `/api/regions/`                                 | Distinct regions from `ph_muni`                          |
| GET    | `/api/provinces/?region=<name>`                 | Distinct provinces for a region                          |
| GET    | `/api/provinces/<name>/geometry/`               | Municipalities of a province (FeatureCollection)         |
| GET    | `/api/provinces/<name>/border/`                 | Dissolved province polygon (FeatureCollection)           |
| GET    | `/api/municipalities/by-point/?lon=&lat=`       | Municipality / province / region for a point             |
| GET    | `/api/municipalities/all/`                      | All municipalities (FeatureCollection)                   |
| GET    | `/api/landcover/?province=<name>`               | Land-cover polygons within a province                    |
| GET    | `/api/landcover/all/`                           | All land-cover polygons                                  |
| GET    | `/api/points/`                                  | All location points (FeatureCollection)                  |
| POST   | `/api/points/add/`                              | Create a location point (`{name, description, category, intensity, lon, lat}`) |
| DELETE | `/api/points/<id>/delete/`                      | Delete a location point                                  |
| GET    | `/api/tiles/municipalities/<z>/<x>/<y>/`        | MVT tiles for the national municipality layer            |
| GET    | `/api/tiles/landcover/<z>/<x>/<y>/`             | MVT tiles for the national land-cover layer              |

### Tests

```bash
cd backend
pytest
```

## Frontend setup (`frontend/`)

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Other scripts:

```bash
npm run build
npm run preview
npm run lint
```

By default the frontend talks to `http://localhost:8000`. To override,
create `frontend/.env`:

```env
VITE_DJANGO_API_BASE_URL=http://localhost:8000
```

## Data model

`backend/landcover/models.py` defines:

- `Municipality` (unmanaged, table `ph_muni`) — region/province/municipality
  names, codes, and a `MultiPolygon` geometry.
- `LandCover` (unmanaged, table `landcover_polygons`) — `classname` (mapped
  to the `descript` column) plus `MultiPolygon` geometry.
- `LocationPoint` (managed, table `location_points`) — user-added points
  with `name`, `description`, `category`, `intensity`, `Point` geometry,
  and `created_at`. Driven by migration `0006_locationpoint`.

Because `Municipality` and `LandCover` are `managed = False`, their
tables must be loaded into PostGIS out-of-band (see Backend setup
step 2).

## Local data policy

Raw GIS datasets and `ph_muni.sql` live under `backend/data/` /
`backend/` and are gitignored to avoid oversized pushes. See
`backend/data/README.md` for details.
