import pytest
from django.contrib.gis.geos import Polygon
from rest_framework.test import APIClient

from landcover.models import LandCoverPolygon


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def seed_landcover(db):
    LandCoverPolygon.objects.create(
        descript="Built-up",
        province="Agusan del Sur",
        geom=Polygon(
            (
                (125.50, 8.90),
                (125.70, 8.90),
                (125.70, 9.05),
                (125.50, 9.05),
                (125.50, 8.90),
            ),
            srid=4326,
        ),
    )

    LandCoverPolygon.objects.create(
        descript="Forest",
        province="Agusan del Sur",
        geom=Polygon(
            (
                (125.72, 8.95),
                (125.82, 8.95),
                (125.82, 9.02),
                (125.72, 9.02),
                (125.72, 8.95),
            ),
            srid=4326,
        ),
    )


@pytest.mark.django_db
def test_landcover_by_point_returns_match(client, seed_landcover):
    resp = client.get("/api/landcover/by-point/?lon=125.60&lat=8.97")
    assert resp.status_code == 200
    assert resp.data["count"] == 1
    assert resp.data["results"][0]["descript"] == "Built-up"


@pytest.mark.django_db
def test_landcover_by_point_returns_empty_for_outside_point(client, seed_landcover):
    resp = client.get("/api/landcover/by-point/?lon=125.90&lat=9.20")
    assert resp.status_code == 200
    assert resp.data["count"] == 0
    assert resp.data["results"] == []


@pytest.mark.django_db
def test_landcover_by_point_requires_lon_lat(client):
    resp = client.get("/api/landcover/by-point/?lon=125.60")
    assert resp.status_code == 400
    assert "Missing required query params" in resp.data["detail"]
