from django.urls import path

from . import views

urlpatterns = [
    path("regions/", views.regions, name="regions"),
    path("provinces/", views.provinces, name="provinces"),
    path(
        "provinces/<str:province_name>/geometry/",
        views.province_geometry,
        name="province-geometry",
    ),
    path("municipalities/by-point/", views.municipality_by_point, name="municipality-by-point"),
    path("municipalities/all/", views.all_municipalities, name="all-municipalities"),
    path(
        "tiles/municipalities/<int:z>/<int:x>/<int:y>/",
        views.MunicipalityTileView.as_view(),
        name="municipality-tiles",
    ),
    path("landcover/", views.landcover_by_province, name="landcover-by-province"),
    path("landcover/all/", views.all_landcover, name="all-landcover"),
    path(
        "tiles/landcover/<int:z>/<int:x>/<int:y>/",
        views.LandCoverTileView.as_view(),
        name="landcover-tiles",
    ),
]
