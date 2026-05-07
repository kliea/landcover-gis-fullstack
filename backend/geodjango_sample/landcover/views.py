import json

from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import AsGeoJSON
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import LandCoverPolygon, Municipality
from .serializers import LandCoverPolygonSerializer


class LandCoverByPointView(APIView):
    """
    Return land cover polygons that contain the given lon/lat point.
    """

    def get(self, request):
        lon = request.query_params.get("lon")
        lat = request.query_params.get("lat")

        if lon is None or lat is None:
            return Response(
                {"detail": "Missing required query params: lon, lat"},
                status=400,
            )

        point = Point(float(lon), float(lat), srid=4326)
        polygons = LandCoverPolygon.objects.filter(geom__contains=point)

        payload = LandCoverPolygonSerializer(polygons, many=True).data
        return Response({"count": len(payload), "results": payload})


class RegionListView(APIView):
    def get(self, request):
        regions = (
            Municipality.objects.exclude(reg_name__isnull=True)
            .exclude(reg_name="")
            .values_list("reg_name", flat=True)
            .distinct()
            .order_by("reg_name")
        )
        return Response({"count": len(regions), "results": list(regions)})


class ProvinceListByRegionView(APIView):
    def get(self, request):
        region = request.query_params.get("region")
        if not region:
            return Response({"detail": "Missing required query param: region"}, status=400)

        provinces = (
            Municipality.objects.filter(reg_name=region)
            .exclude(pro_name__isnull=True)
            .exclude(pro_name="")
            .values_list("pro_name", flat=True)
            .distinct()
            .order_by("pro_name")
        )
        return Response({"count": len(provinces), "results": list(provinces)})


class MunicipalityGeometryByProvinceView(APIView):
    def get(self, request, province):
        rows = (
            Municipality.objects.filter(pro_name=province)
            .annotate(geometry=AsGeoJSON("geom"))
            .values("gid", "mun_name", "pro_name", "geometry")
        )
        features = [
            {
                "type": "Feature",
                "id": row["gid"],
                "properties": {
                    "mun_name": row["mun_name"],
                    "pro_name": row["pro_name"],
                },
                "geometry": json.loads(row["geometry"]),
            }
            for row in rows
        ]
        return Response(
            {
                "count": len(features),
                "type": "FeatureCollection",
                "features": features,
            }
        )


class MunicipalityByPointView(APIView):
    def get(self, request):
        lon = request.query_params.get("lon")
        lat = request.query_params.get("lat")

        if lon is None or lat is None:
            return Response(
                {"detail": "Missing required query params: lon, lat"},
                status=400,
            )

        point = Point(float(lon), float(lat), srid=4326)
        match = Municipality.objects.filter(geom__contains=point).first()
        if not match:
            return Response({"result": None})

        return Response(
            {
                "result": {
                    "gid": match.gid,
                    "reg_name": match.reg_name,
                    "pro_name": match.pro_name,
                    "mun_name": match.mun_name,
                }
            }
        )
