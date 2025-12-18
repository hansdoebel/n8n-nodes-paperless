import type { IDataObject } from "n8n-workflow";

/**
 * Mock template response from Paperless API
 */
export const mockTemplateResponse: IDataObject = {
  id: "311",
  workspace_id: 1206,
  name: "Test Template",
  description: "A test template for unit testing",
  creator_id: 2508,
  created_at: "2024-01-01T10:00:00Z",
  updated_at: "2024-01-01T12:00:00Z",
  original_content_locale: "en-US",
  rendering_locale: "en-US",
  forwarding_allowed: false,
  delegation_allowed: false,
  participant_completed_redirect_url: null,
  settings: {},
  reminder_settings: null,
  content_locale_settings: [],
  localized_attributes: {},
  styles: {},
};

/**
 * Mock template list response
 */
export const mockTemplateListResponse: IDataObject[] = [
  {
    id: "311",
    workspace_id: 1206,
    name: "Template 1",
    description: "First template",
    creator_id: 2508,
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T12:00:00Z",
  },
  {
    id: "312",
    workspace_id: 1206,
    name: "Template 2",
    description: "Second template",
    creator_id: 2508,
    created_at: "2024-01-02T10:00:00Z",
    updated_at: "2024-01-02T12:00:00Z",
  },
];

/**
 * Mock document response
 */
export const mockDocumentResponse: IDataObject = {
  id: "123",
  workspace_id: 1206,
  name: "Test Document",
  description: "A test document",
  creator_id: 2508,
  created_at: "2024-01-01T10:00:00Z",
  updated_at: "2024-01-01T12:00:00Z",
  template_id: "311",
};

/**
 * Mock blob response
 */
export const mockBlobResponse: IDataObject = {
  signed_id: "blob_signed_id_abc123",
  filename: "test.pdf",
  content_type: "application/pdf",
  byte_size: 12345,
  created_at: "2024-01-01T10:00:00Z",
};

/**
 * Mock process run response
 */
export const mockProcessRunResponse: IDataObject = {
  id: "pr_123",
  workspace_id: 1206,
  template_id: "311",
  status: "pending",
  created_at: "2024-01-01T10:00:00Z",
  updated_at: "2024-01-01T12:00:00Z",
};

/**
 * Mock submission response
 */
export const mockSubmissionResponse: IDataObject = {
  id: "sub_123",
  workspace_id: 1206,
  template_id: "311",
  process_run_id: "pr_123",
  status: "completed",
  data: {},
  created_at: "2024-01-01T10:00:00Z",
  updated_at: "2024-01-01T12:00:00Z",
};

/**
 * Mock error response from API
 */
export const mockErrorResponse = {
  error: {
    message: "Resource not found",
    code: "not_found",
    status: 404,
  },
};

/**
 * Mock expanded template response with related resources
 */
export const mockExpandedTemplateResponse: IDataObject = {
  ...mockTemplateResponse,
  creator: {
    id: 2508,
    email: "creator@example.com",
    name: "Test Creator",
  },
  participants: [],
  blocks: [],
  designs: [],
  participation_flow: null,
  tokens: [],
};
