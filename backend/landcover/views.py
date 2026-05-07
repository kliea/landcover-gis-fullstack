from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.aggregates import Union
from rest_framework.decorators import api_view
from rest_framework.response import Response
from vectortiles.backends.postgis import VectorLayer
from vectortiles.rest_framework.views import MVTAPIView

from .models import LandCover, LocationPoint, Municipality
from .serializers import (
    LandCoverSerializer,
    LocationPointInputSerializer,
    LocationPointSerializer,
    MunicipalitySerializer,
)


@api_view(["GET"])
def regions(request):
    qs = (
        Municipality.objects.values("reg_name", "phcode_reg")
        .distinct()
        .order_by("reg_name")
    )
    return Response({"results": list(qs)})


@api_view(["GET"])
def provinces(request):
    region = request.GET.get("region")
    if not region:
        return Response({"detail": "Missing required query param: region"}, status=400)
    qs = (
        Municipality.objects.filter(reg_name__iexact=region)
        .values("pro_name", "phcode_pro")
        .distinct()
        .order_by("pro_name")
    )
    return Response({"results": list(qs)})


@api_view(["GET"])
def province_geometry(request, province_name):
    qs = Municipality.objects.filter(pro_name__iexact=province_name)
    serializer = MunicipalitySerializer(qs, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def municipality_by_point(request):
    lon = request.GET.get("lon")
    lat = request.GET.get("lat")

    if lon is None or lat is None:
        return Response({"detail": "Missing required query params: lon, lat"}, status=400)

    point = Point(float(lon), float(lat), srid=4326)
    muni = Municipality.objects.filter(wkb_geometry__contains=point).first()
    if not muni:
        return Response({"result": None})

    return Response(
        {
            "result": {
                "mun_name": muni.mun_name,
                "pro_name": muni.pro_name,
                "reg_name": muni.reg_name,
                "phcode_mun": muni.phcode_mun,
            }
        }
    )


@api_view(["GET"])
def landcover_by_province(request):
    province = request.GET.get("province")
    if not province:
        return Response({"type": "FeatureCollection", "features": []})

    union_geom = Municipality.objects.filter(pro_name__iexact=province).aggregate(
        geom=Union("wkb_geometry")
    )["geom"]
    if not union_geom:
        return Response({"type": "FeatureCollection", "features": []})

    qs = LandCover.objects.filter(wkb_geometry__intersects=union_geom)
    serializer = LandCoverSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def all_municipalities(request):
    qs = Municipality.objects.all()
    serializer = MunicipalitySerializer(qs, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def all_landcover(request):
    qs = LandCover.objects.all()
    serializer = LandCoverSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def location_points(request):
    qs = LocationPoint.objects.all()
    serializer = LocationPointSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def add_location_point(request):
    serializer = LocationPointInputSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"status": "created"}, status=201)
    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
def delete_location_point(request, point_id):
    try:
        point = LocationPoint.objects.get(id=point_id)
        point.delete()
        return Response({"status": "deleted"})
    except LocationPoint.DoesNotExist:
        return Response({"error": "not found"}, status=404)


class MunicipalityVectorLayer(VectorLayer):
    model = Municipality
    id = "municipalities"
    geom_field = "wkb_geometry"
    tile_fields = ("reg_name", "pro_name", "mun_name")


class LandCoverVectorLayer(VectorLayer):
    model = LandCover
    id = "landcover"
    geom_field = "wkb_geometry"
    tile_fields = ("classname",)


class MunicipalityTileView(MVTAPIView):
    layer_classes = [MunicipalityVectorLayer]


class LandCoverTileView(MVTAPIView):
    layer_classes = [LandCoverVectorLayer]
