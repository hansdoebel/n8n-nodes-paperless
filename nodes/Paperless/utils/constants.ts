export const API_ENDPOINTS = {
  BASE_URL: "https://api.paperless.io/api/v1",
  BLOBS_CREATE: "/blobs/",
  DOCUMENTS_CREATION_PARAMETERS: "/documents/",
  DOCUMENTS_GET_ALL: "/documents/",
  DOCUMENTS_GET: (id: string) => `/documents/${id}`,
  DOCUMENTS_CREATE: "/documents/",
  DOCUMENTS_UPDATE: (id: string) => `/documents/${id}`,
  DOCUMENTS_DELETE: (id: string) => `/documents/${id}`,
  PROCESS_RUNS_CREATE: "/process_runs/",
  SUBMISSIONS_GET: (id: string) => `/submissions/${id}`,
  TEMPLATES_GET_ALL: "/templates/",
  TEMPLATES_GET: (id: string) => `/templates/${id}`,
};
