from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .models import LandCover, Municipality


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
