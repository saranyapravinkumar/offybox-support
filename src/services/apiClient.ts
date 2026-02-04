const BASE_URL = import.meta.env.VITE_OFFYBOX_API_URL || 'https://api.offybox.com/v1';
const SECRET_TOKEN = import.meta.env.VITE_OFFYBOX_TOKEN;

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SECRET_TOKEN}`,
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    return response.json();
}
