import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestOptions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { API_ENDPOINTS } from "../../utils/constants";

const showForTemplateCreate = {
  operation: ["create"],
  resource: ["template"],
};

export const templateCreateDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "hidden",
    default: "create",
  },
  {
    displayName: "Workspace ID",
    name: "workspace_id",
    type: "number",
    required: true,
    default: 0,
    displayOptions: {
      show: showForTemplateCreate,
    },
    description: "ID of the workspace the new template will belong to",
    routing: {
      send: {
        type: "body",
        property: "workspace_id",
      },
    },
  },
  {
    displayName: "Name",
    name: "name",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForTemplateCreate,
    },
    description: "Name of the template",
    routing: {
      send: {
        type: "body",
        property: "name",
      },
    },
  },
  {
    displayName: "Duplicate From Template ID",
    name: "template_id",
    type: "string",
    default: "",
    displayOptions: {
      show: showForTemplateCreate,
    },
    description:
      "If set, a new template will be created by duplicating this existing template ID",
    routing: {
      send: {
        type: "body",
        property: "template_id",
      },
    },
  },
  {
    displayName: "Copy From Document ID",
    name: "document_id",
    type: "string",
    default: "",
    displayOptions: {
      show: showForTemplateCreate,
    },
    description:
      "If set, content from the given document ID will be copied into the new template",
    routing: {
      send: {
        type: "body",
        property: "document_id",
      },
    },
  },
  {
    displayName: "PDF Blob Signed ID",
    name: "pdf_blob_signed_id",
    type: "string",
    default: "",
    displayOptions: {
      show: showForTemplateCreate,
    },
    description:
      "Signed ID of an already-uploaded PDF blob to be used when creating the template",
    routing: {
      send: {
        type: "body",
        property: "pdf",
      },
    },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForTemplateCreate,
    },
    options: [
      {
        displayName: "Content Locale Settings (JSON)",
        name: "content_locale_settings",
        type: "json",
        default: "",
        description:
          "Array of content-locale settings. Enter valid JSON array per API shape.",
      },
      {
        displayName: "Delegation Allowed",
        name: "delegation_allowed",
        type: "boolean",
        default: false,
        description: "Whether delegation is allowed",
      },
      {
        displayName: "Description",
        name: "description",
        type: "string",
        default: "",
        description: "Template description",
      },
      {
        displayName: "Expand",
        name: "expand",
        type: "multiOptions",
        default: [],
        options: [
          { name: "Blocks", value: "blocks" },
          { name: "Creator", value: "creator" },
          { name: "Designs", value: "designs" },
          { name: "Participants", value: "participants" },
          { name: "Participation Flow", value: "participation_flow" },
          { name: "Tokens", value: "tokens" },
        ],
        description: "Related resources to expand in the response",
      },
      {
        displayName: "Forwarding Allowed",
        name: "forwarding_allowed",
        type: "boolean",
        default: false,
        description: "Whether forwarding is allowed",
      },
      {
        displayName: "Localized Attributes (JSON)",
        name: "localized_attributes",
        type: "json",
        default: "",
        description:
          "Localized attributes object. Enter valid JSON for locales (see API docs).",
      },
      {
        displayName: "Original Content Locale",
        name: "original_content_locale",
        type: "options",
        options: [
          { name: "De-DE", value: "de-DE" },
          { name: "En-US", value: "en-US" },
          { name: "Es-ES", value: "es-ES" },
          { name: "Fr-FR", value: "fr-FR" },
          { name: "Ru-RU", value: "ru-RU" },
          { name: "Tr-TR", value: "tr-TR" },
          { name: "Uk-UA", value: "uk-UA" },
          { name: "Zh-CN", value: "zh-CN" },
        ],
        default: "en-US",
        description: "Locale of the original content",
      },
      {
        displayName: "Paperless-Version Header",
        name: "paperless_version",
        type: "options",
        options: [
          { name: "2022-06-08", value: "2022-06-08" },
          { name: "2022-11-01", value: "2022-11-01" },
          { name: "2023-02-07", value: "2023-02-07" },
          { name: "2023-04-27", value: "2023-04-27" },
          { name: "2023-05-30", value: "2023-05-30" },
          { name: "2023-06-23", value: "2023-06-23" },
        ],
        default: "2023-06-23",
        description:
          "Optional Paperless-Version header. Use to opt into a specific API version.",
      },
      {
        displayName: "Participant Completed Redirect URL",
        name: "participant_completed_redirect_url",
        type: "string",
        default: "",
        description:
          "URL to redirect participants to when they finish interacting with the template",
      },
      {
        displayName: "Reminder Settings (JSON)",
        name: "reminder_settings",
        type: "json",
        default: "",
        description:
          "Reminder settings object. Enter valid JSON per API shape if used.",
      },
      {
        displayName: "Rendering Locale",
        name: "rendering_locale",
        type: "options",
        options: [
          { name: "De-DE", value: "de-DE" },
          { name: "En-US", value: "en-US" },
          { name: "Fr-FR", value: "fr-FR" },
          { name: "Tr-TR", value: "tr-TR" },
          { name: "Uk-UA", value: "uk-UA" },
        ],
        default: "en-US",
        description: "Locale used for rendering",
      },
      {
        displayName: "Settings (JSON)",
        name: "settings",
        type: "json",
        default: "",
        description:
          'Arbitrary settings object. Enter valid JSON. (e.g. {"setting":true})',
      },
      {
        displayName: "Styles (JSON)",
        name: "styles",
        type: "json",
        default: "",
        description: "Styles object as JSON",
      },
    ],
  },
];

function buildCreateBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  const workspaceId = this.getNodeParameter("workspace_id", 0) as number;
  const name = this.getNodeParameter("name", 0) as string;

  body.workspace_id = workspaceId;
  body.name = name;

  // Top-level optional fields
  const templateId = this.getNodeParameter("template_id", 0) as string;
  if (templateId) {
    body.template_id = templateId;
  }

  const documentId = this.getNodeParameter("document_id", 0) as string;
  if (documentId) {
    body.document_id = documentId;
  }

  const pdfBlobSignedId = this.getNodeParameter(
    "pdf_blob_signed_id",
    0,
  ) as string;
  if (pdfBlobSignedId) {
    body.pdf = pdfBlobSignedId;
  }

  const optionalSingle = [
    "description",
    "original_content_locale",
    "rendering_locale",
    "participant_completed_redirect_url",
    "forwarding_allowed",
    "delegation_allowed",
    "settings",
    "reminder_settings",
    "content_locale_settings",
    "localized_attributes",
    "styles",
  ];

  // Additional fields collection
  const additional =
    (this.getNodeParameter("additionalFields", 0, {}) || {}) as IDataObject;

  for (const key of optionalSingle) {
    if (
      key in additional && additional[key] !== undefined &&
      additional[key] !== ""
    ) {
      // For settings-like fields, they may be JSON strings when entered in UI.
      if (
        key === "settings" ||
        key === "reminder_settings" ||
        key === "content_locale_settings" ||
        key === "localized_attributes" ||
        key === "styles"
      ) {
        const raw = additional[key] as string;
        if (raw === "") continue;
        try {
          // allow passing actual objects too
          body[key] = typeof raw === "string" ? JSON.parse(raw) : raw;
        } catch {
          // If parse fails, pass the raw value (the API will likely error). Caller should ensure valid JSON.
          body[key] = raw;
        }
      } else {
        body[key] = additional[key];
      }
    }
  }

  // Map forwarding/delegation if present as booleans (they may already be booleans)
  if ("forwarding_allowed" in additional) {
    body.forwarding_allowed = !!additional.forwarding_allowed;
  }
  if ("delegation_allowed" in additional) {
    body.delegation_allowed = !!additional.delegation_allowed;
  }

  // Expand parameter is sent as query, not in body. Leave here to be read by execute.
  return body;
}

/**
 * Execute function for creating a template.
 * Call this using: await templateCreate.call(this);
 *
 * Returns an array of INodeExecutionData (single item containing the JSON response).
 */
export async function templateCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildCreateBody.call(this);

  // Build query params
  const expand = (this.getNodeParameter("additionalFields.expand", 0, []) ||
    []) as string[];
  const qs: IDataObject = {};
  if (Array.isArray(expand) && expand.length) {
    // API expects comma-separated expand values
    qs.expand = expand.join(",");
  }

  // Optional header Paperless-Version
  const paperlessVersion = this.getNodeParameter(
    "additionalFields.paperless_version",
    0,
    "",
  ) as string;

  // Get credentials for Authorization header
  const credentials = await this.getCredentials("paperlessApi");
  const accessToken = credentials?.accessToken as string;

  const headers: IDataObject = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  const requestOptions: IHttpRequestOptions = {
    method: "POST",
    baseURL: API_ENDPOINTS.BASE_URL,
    url: "/templates",
    body,
    qs,
    headers,
  };

  if (paperlessVersion) {
    headers["Paperless-Version"] = paperlessVersion;
  }

  const responseData = await this.helpers.httpRequest!(requestOptions);

  // Wrap the response in INodeExecutionData and return
  const executionData: INodeExecutionData = {
    json: responseData,
  };

  return [executionData];
}

export default templateCreateDescription;
