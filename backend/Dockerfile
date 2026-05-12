# Render: Root Directory = backend, Dockerfile Path = Dockerfile (or ./Dockerfile).
# Local build from repo root:
#   docker build -f backend/Dockerfile backend
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    binutils \
    gcc \
    gdal-bin \
    libgdal-dev \
    libgeos-dev \
    libproj-dev \
    && rm -rf /var/lib/apt/lists/*

ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

WORKDIR /app

COPY . /app/

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Render sets PORT; shell form expands $PORT at runtime.
CMD ["sh", "-c", "gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000}"]
