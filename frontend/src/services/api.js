const rawBase =
	import.meta.env.VITE_API_URL ||
	import.meta.env.VITE_DJANGO_API_BASE_URL ||
	'http://localhost:8000';
const djangoApiBaseUrl = String(rawBase).replace(/\/+$/, '');

export const API_CONFIG = {
	baseURL: djangoApiBaseUrl,
	djangoApiBaseUrl,
};
