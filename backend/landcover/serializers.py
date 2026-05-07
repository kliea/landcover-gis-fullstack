from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers

from .models import LandCover, LocationPoint, Municipality


class MunicipalitySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Municipality
        geo_field = "wkb_geometry"
        fields = [
            "ogc_fid",
            "reg_name",
            "pro_name",
            "mun_name",
            "phcode_reg",
            "phcode_pro",
            "phcode_mun",
        ]


class LandCoverSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = LandCover
        geo_field = "wkb_geometry"
        fields = ["ogc_fid", "classname"]


class LocationPointSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = LocationPoint
        geo_field = "wkb_geometry"
        fields = ["id", "name", "description", "category", "intensity"]


class LocationPointInputSerializer(serializers.ModelSerializer):
    lon = serializers.FloatField(write_only=True)
    lat = serializers.FloatField(write_only=True)

    class Meta:
        model = LocationPoint
        fields = ["name", "description", "category", "intensity", "lon", "lat"]

    def create(self, validated_data):
        from django.contrib.gis.geos import Point

        lon = validated_data.pop("lon")
        lat = validated_data.pop("lat")
        validated_data["wkb_geometry"] = Point(lon, lat, srid=4326)
        return LocationPoint.objects.create(**validated_data)
