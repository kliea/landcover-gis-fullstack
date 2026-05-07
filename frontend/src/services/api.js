const djangoApiBaseUrl =
	import.meta.env.VITE_DJANGO_API_BASE_URL || 'http://localhost:8000';

export const API_CONFIG = {
	baseURL: djangoApiBaseUrl,
	djangoApiBaseUrl,
};
