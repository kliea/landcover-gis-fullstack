from django.urls import path

from .views import (
    LandCoverByPointView,
    MunicipalityByPointView,
    MunicipalityGeometryByProvinceView,
    ProvinceListByRegionView,
    RegionListView,
)

urlpatterns = [
    path("api/landcover/by-point/", LandCoverByPointView.as_view(), name="landcover-by-point"),
    path("api/regions/", RegionListView.as_view(), name="regions"),
    path(
        "api/provinces/",
        ProvinceListByRegionView.as_view(),
        name="provinces-by-region",
    ),
    path(
        "api/provinces/<str:province>/geometry/",
        MunicipalityGeometryByProvinceView.as_view(),
        name="municipality-geometry-by-province",
    ),
    path("api/municipalities/by-point/", MunicipalityByPointView.as_view(), name="municipality-by-point"),
]
