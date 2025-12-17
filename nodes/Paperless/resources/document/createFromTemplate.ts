import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestOptions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { API_ENDPOINTS } from "../../utils/constants";

const showForDocumentCreateFromTemplate = {
  operation: ["createFromTemplate"],
  resource: ["document"],
};

export const documentCreateFromTemplateDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "hidden",
    default: "createFromTemplate",
  },
  {
    displayName: "Workspace ID",
    name: "workspace_id",
    type: "number",
    required: true,
    default: 0,
    displayOptions: {
      show: showForDocumentCreateFromTemplate,
    },
    typeOptions: {
      minValue: 1,
      numberPrecision: 0,
    },
    description: "ID of the workspace the new document will be placed in",
  },
  {
    displayName: "Template ID",
    name: "template_id",
    type: "number",
    required: true,
    default: 0,
    displayOptions: {
      show: showForDocumentCreateFromTemplate,
    },
    typeOptions: {
      minValue: 1,
      numberPrecision: 0,
    },
    description: "ID of the template to use as a blueprint",
  },
  {
    displayName: "Name",
    name: "name",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForDocumentCreateFromTemplate,
    },
    description: "Name of the document",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForDocumentCreateFromTemplate,
    },
    options: [
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
        description: "Document description",
      },
      {
        displayName: "Forwarding Allowed",
        name: "forwarding_allowed",
        type: "boolean",
        default: false,
        description: "Whether forwarding is allowed",
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
        description: "Optional Paperless-Version header",
      },
      {
        displayName: "Rendering Locale",
        name: "rendering_locale",
        type: "options",
        default: "en-US",
        options: [
          { name: "Chinese (Simplified)", value: "zh-CN" },
          { name: "English (US)", value: "en-US" },
          { name: "French", value: "fr-FR" },
          { name: "German", value: "de-DE" },
          { name: "Russian", value: "ru-RU" },
          { name: "Spanish", value: "es-ES" },
          { name: "Turkish", value: "tr-TR" },
          { name: "Ukrainian", value: "uk-UA" },
        ],
        description: "Locale for rendering",
      },
      {
        displayName: "State",
        name: "state",
        type: "options",
        default: "",
        options: [
          { name: "None", value: "" },
          { name: "Dispatched", value: "dispatched" },
        ],
        description: "Set to dispatched to dispatch immediately",
      },
    ],
  },
];

function buildCreateFromTemplateBody(
  this: IExecuteFunctions,
): IDataObject {
  const body: IDataObject = {};

  body.workspace_id = this.getNodeParameter("workspace_id", 0) as number;
  body.template_id = this.getNodeParameter("template_id", 0) as number;
  body.name = this.getNodeParameter("name", 0) as string;

  const additional =
    (this.getNodeParameter("additionalFields", 0, {}) || {}) as IDataObject;

  if (additional.description) {
    body.description = additional.description;
  }
  if (additional.rendering_locale) {
    body.rendering_locale = additional.rendering_locale;
  }
  if (additional.state) {
    body.state = additional.state;
  }
  if (additional.forwarding_allowed !== undefined) {
    body.forwarding_allowed = additional.forwarding_allowed;
  }
  if (additional.delegation_allowed !== undefined) {
    body.delegation_allowed = additional.delegation_allowed;
  }

  return body;
}

export async function documentCreateFromTemplate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildCreateFromTemplateBody.call(this);

  const additional =
    (this.getNodeParameter("additionalFields", 0, {}) || {}) as IDataObject;
  const paperlessVersion = (additional.paperless_version as string) || "";

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
    url: API_ENDPOINTS.DOCUMENTS_CREATE,
    body,
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

export default documentCreateFromTemplateDescription;
