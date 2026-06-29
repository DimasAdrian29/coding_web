const API_BASE_URL = "/api";
const AUTH_STORAGE_KEY = "smkn5-coder-auth";

function readStoredAuth() {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const storedAuth = readStoredAuth();
  const legacyUser = (() => {
    try {
      const raw = window.localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  const token = window.localStorage.getItem("token") ?? storedAuth?.token;
  const userId = window.localStorage.getItem("user_id") ?? storedAuth?.user?.id ?? legacyUser?.id;
  const headers = {
    Accept: "application/json",
    ...isFormData ? {} : { "Content-Type": "application/json" },
    ...token ? { Authorization: `Bearer ${token}` } : {},
    ...userId ? { "X-User-Id": userId } : {},
    ...options.headers ?? {}
  };
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "same-origin",
    headers,
    ...options
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) {
    const error = new Error(payload?.message ?? "Gagal memuat data. Coba lagi.");
    error.status = response.status;
    error.errors = payload?.errors ?? {};
    throw error;
  }
  return payload.data;
}
const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body ?? {}) }),
  postForm: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body ?? {}) }),
  putForm: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body: JSON.stringify(body ?? {}) }),
  delete: (path) => request(path, { method: "DELETE" })
};
export {
  api
};
