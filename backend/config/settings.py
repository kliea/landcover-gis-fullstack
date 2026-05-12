import os
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env", override=True)

# -- GIS library paths ---------------------------------------------------------
# Must be applied before Django/GDAL initializes - order matters.
# Only use paths that exist on this machine. Stale Windows paths often end up in
# production env (e.g. Render) if copied from a local .env — those must not be
# passed through or Django raises OSError loading the DLL/SO.
def _env_existing_file(var: str):
    p = (os.getenv(var) or "").strip()
    return p if p and os.path.isfile(p) else None


def _env_existing_dir(var: str):
    p = (os.getenv(var) or "").strip()
    return p if p and os.path.isdir(p) else None


_proj = _env_existing_dir("PROJ_LIB")
if _proj:
    os.environ["PROJ_LIB"] = _proj
    os.environ["PROJ_DATA"] = _proj  # GDAL 3.x looks for PROJ_DATA too
else:
    # Drop invalid / cross-platform paths so PROJ does not point at missing trees
    for key in ("PROJ_LIB", "PROJ_DATA"):
        if key in os.environ and not _env_existing_dir(key):
            os.environ.pop(key, None)

GDAL_LIBRARY_PATH = _env_existing_file("GDAL_LIBRARY_PATH")
GEOS_LIBRARY_PATH = _env_existing_file("GEOS_LIBRARY_PATH")
# -----------------------------------------------------------------------------

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-only-secret-key-change-me")
DEBUG = os.getenv("DJANGO_DEBUG", "true").lower() == "true"

raw_hosts = os.getenv("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1")
ALLOWED_HOSTS = [host.strip() for host in raw_hosts.split(",") if host.strip()]

# Render injects these for Web Services; Docker deploys often omit DJANGO_ALLOWED_HOSTS.
def _merge_render_allowed_hosts(hosts: list[str]) -> None:
    for key in ("RENDER_EXTERNAL_HOSTNAME", "RENDER_EXTERNAL_URL"):
        raw = (os.getenv(key) or "").strip()
        if not raw:
            continue
        if raw.startswith(("http://", "https://")):
            hostname = urlparse(raw).hostname
            if hostname and hostname not in hosts:
                hosts.append(hostname)
        elif raw not in hosts:
            hosts.append(raw)


_merge_render_allowed_hosts(ALLOWED_HOSTS)

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.gis",
    "corsheaders",
    "rest_framework",
    "rest_framework_gis",
    "vectortiles",
    "landcover",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "https://landcover-gis-fullstack.onrender.com",
]
_cors_extra = os.getenv("DJANGO_CORS_ALLOWED_ORIGINS", "")
for _origin in _cors_extra.split(","):
    _o = _origin.strip()
    if _o and _o not in CORS_ALLOWED_ORIGINS:
        CORS_ALLOWED_ORIGINS.append(_o)

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"


def _database_config() -> dict:
    """Use DATABASE_URL when set (Render / Heroku style). Otherwise DB_* env vars."""
    database_url = (os.getenv("DATABASE_URL") or "").strip()
    if database_url:
        if database_url.startswith("postgres://"):
            database_url = "postgresql://" + database_url[len("postgres://") :]
        parsed = urlparse(database_url)
        query = parse_qs(parsed.query)
        name = (parsed.path or "").lstrip("/")
        port = parsed.port or 5432
        cfg = {
            "ENGINE": "django.contrib.gis.db.backends.postgis",
            "NAME": unquote(name) if name else "",
            "USER": unquote(parsed.username) if parsed.username else "",
            "PASSWORD": unquote(parsed.password) if parsed.password else "",
            "HOST": parsed.hostname or "",
            "PORT": str(port),
        }
        opts: dict = {}
        if query.get("sslmode") and query["sslmode"][0]:
            opts["sslmode"] = query["sslmode"][0]
        host = (parsed.hostname or "").lower()
        if host not in ("", "localhost", "127.0.0.1"):
            opts.setdefault("sslmode", "require")
        if opts:
            cfg["OPTIONS"] = opts
        return cfg

    host = (os.getenv("DB_HOST") or "localhost").strip().lower()
    cfg = {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": os.getenv("DB_NAME", "landcover"),
        "USER": os.getenv("DB_USER", "postgres"),
        "PASSWORD": os.getenv("DB_PASSWORD", ""),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
    # Managed Postgres (e.g. Render) needs TLS; local Docker often uses DB_SSLMODE=disable.
    if host not in ("", "localhost", "127.0.0.1"):
        sslmode = (os.getenv("DB_SSLMODE") or "require").strip()
        if sslmode:
            cfg["OPTIONS"] = {"sslmode": sslmode}
    return cfg


DATABASES = {"default": _database_config()}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Manila"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
