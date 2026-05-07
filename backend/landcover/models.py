from django.contrib.gis.db import models


class LandCoverPolygon(models.Model):
    descript = models.CharField(max_length=120)
    province = models.CharField(max_length=80)
    geom = models.PolygonField(srid=4326)

    class Meta:
        db_table = "landcover_polygon"

    def __str__(self) -> str:
        return self.descript


class Municipality(models.Model):
    ogc_fid = models.AutoField(primary_key=True)
    phcode_reg = models.CharField(max_length=254)
    reg_name = models.CharField(max_length=254)
    phcode_pro = models.CharField(max_length=254)
    pro_name = models.CharField(max_length=254)
    phcode_mun = models.CharField(max_length=254)
    mun_name = models.CharField(max_length=254)
    wkb_geometry = models.MultiPolygonField(srid=4326)

    class Meta:
        managed = False
        db_table = "ph_muni"

    def __str__(self) -> str:
        return f"{self.mun_name} ({self.pro_name})"


class LandCover(models.Model):
    ogc_fid = models.AutoField(primary_key=True)
    classname = models.CharField(max_length=254, db_column="descript")
    wkb_geometry = models.MultiPolygonField(srid=4326)

    class Meta:
        managed = False
        db_table = "landcover_polygons"

    def __str__(self) -> str:
        return self.classname
