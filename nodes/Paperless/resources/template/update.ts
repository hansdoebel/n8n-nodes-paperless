import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestOptions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { API_ENDPOINTS } from "../../utils/constants";

const showForTemplateUpdate = {
  operation: ["update"],
  resource: ["template"],
};

export const templateUpdateDescription: INodeProperties[] = [
  {
    displayName: "Template ID",
    name: "templateId",
    type: "string",
    required: true,
    default: "",
    placeholder: "e.g. 311",
    displayOptions: {
      show: showForTemplateUpdate,
    },
    description: "ID of the template to update",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForTemplateUpdate,
    },
    options: [
      {
        displayName: "Content Locale Settings (JSON)",
        name: "content_locale_settings",
        type: "json",
        default: "",
        description: "Array of content locale settings as JSON",
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
        description: "Localized attributes object as JSON",
      },
      {
        displayName: "Name",
        name: "name",
        type: "string",
        default: "",
        description: "Template name",
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
        displayName: "Participant Completed Redirect URL",
        name: "participant_completed_redirect_url",
        type: "string",
        default: "",
        description:
          "URL to redirect participants to when they complete interacting with the template",
      },
      {
        displayName: "Reminder Settings (JSON)",
        name: "reminder_settings",
        type: "json",
        default: "",
        description: "Reminder settings object as JSON",
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
        description: "Settings object as JSON",
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

function buildUpdateBody(additional: IDataObject): IDataObject {
  const body: IDataObject = {};
  const copyable = [
    "name",
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

  for (const key of copyable) {
    if (!(key in additional)) continue;
    const val = additional[key];
    if (val === undefined || val === "") continue;

    if (
      key === "settings" ||
      key === "reminder_settings" ||
      key === "content_locale_settings" ||
      key === "localized_attributes" ||
      key === "styles"
    ) {
      if (typeof val === "string") {
        try {
          body[key] = JSON.parse(val);
        } catch {
          body[key] = val;
        }
      } else {
        body[key] = val;
      }
    } else if (key === "forwarding_allowed" || key === "delegation_allowed") {
      body[key] = !!val;
    } else {
      body[key] = val;
    }
  }

  return body;
}

export async function templateUpdate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const templateId = this.getNodeParameter("templateId", 0) as string;
  const additional =
    (this.getNodeParameter("additionalFields", 0, {}) || {}) as IDataObject;

  const body = buildUpdateBody(additional);

  const expand = (additional.expand as string[]) || [];
  const qs: IDataObject = {};
  if (Array.isArray(expand) && expand.length) {
    qs.expand = expand.join(",");
  }

  const paperlessVersion = (additional.paperless_version as string) || "";

  const credentials = await this.getCredentials("paperlessApi");
  const accessToken = credentials?.accessToken as string;

  const headers: IDataObject = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  const requestOptions: IHttpRequestOptions = {
    method: "PATCH",
    baseURL: API_ENDPOINTS.BASE_URL,
    url: `/templates/${templateId}`,
    body,
    qs,
    headers,
  };

  if (paperlessVersion) {
    headers["Paperless-Version"] = paperlessVersion;
  }

  const responseData = await this.helpers.httpRequest!(requestOptions);

  const executionData: INodeExecutionData = {
    json: responseData,
  };

  return [executionData];
}

export default templateUpdateDescription;
