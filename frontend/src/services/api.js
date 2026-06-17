export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL  || 'http://localhost:8080'

async function requestJson(path, options = {}) {
	const response = await fetch(`${apiBaseUrl}${path}`, {
		headers: {
			'Content-Type': 'application/json',
			...(options.headers ?? {}),
		},
		...options,
	})

	if (response.status === 204) {
		return null
	}

	const contentType = response.headers.get('content-type') ?? ''
	const body = contentType.includes('application/json')
		? await response.json()
		: await response.text()

	if (!response.ok) {
		const message =
			typeof body === 'string'
				? body || `Request failed with status ${response.status}`
				: body?.message || `Request failed with status ${response.status}`

		throw new Error(message)
	}

	return body
}

export const usersApi = {
	list: () => requestJson('/users'),
	findByEmail: (email) => requestJson(`/users/lookup?email=${encodeURIComponent(email)}`),
	create: (payload) =>
		requestJson('/users', {
			method: 'POST',
			body: JSON.stringify(payload),
		}),
	update: (id, payload) =>
		requestJson(`/users/${id}`, {
			method: 'PUT',
			body: JSON.stringify(payload),
		}),
	remove: (id) =>
		requestJson(`/users/${id}`, {
			method: 'DELETE',
		}),
}