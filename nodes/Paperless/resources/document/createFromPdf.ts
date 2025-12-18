// Docs: https://developers.paperless.io/docs/api/d65d979d4a988-create-a-new-document

import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { API_ENDPOINTS } from "../../utils/constants";
import { paperlessRequest } from "../../utils/helpers";

const showForDocumentCreateFromPdf = {
  operation: ["createFromPdf"],
  resource: ["document"],
};

export const documentCreateFromPdfDescription: INodeProperties[] = [
  {
    displayName: "Workspace ID",
    name: "workspace_id",
    type: "number",
    required: true,
    default: 0,
    placeholder: "e.g. 1234",
    displayOptions: {
      show: showForDocumentCreateFromPdf,
    },
    typeOptions: {
      minValue: 1,
      numberPrecision: 0,
    },
    description: "ID of the workspace the new document will be placed in",
  },
  {
    displayName: "PDF",
    name: "pdf",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForDocumentCreateFromPdf,
    },
    description: "Signed ID of the PDF blob",
  },
  {
    displayName: "Name",
    name: "name",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForDocumentCreateFromPdf,
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
      show: showForDocumentCreateFromPdf,
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
        displayName: "Original Content Locale",
        name: "original_content_locale",
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
    ],
  },
];

function buildCreateFromPdfBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  body.workspace_id = this.getNodeParameter("workspace_id", 0) as number;
  body.pdf = this.getNodeParameter("pdf", 0) as string;
  body.name = this.getNodeParameter("name", 0) as string;

  const additional =
    (this.getNodeParameter("additionalFields", 0, {}) || {}) as IDataObject;

  if (additional.description) {
    body.description = additional.description;
  }
  if (additional.original_content_locale) {
    body.original_content_locale = additional.original_content_locale;
  }
  if (additional.rendering_locale) {
    body.rendering_locale = additional.rendering_locale;
  }
  if (additional.forwarding_allowed !== undefined) {
    body.forwarding_allowed = additional.forwarding_allowed;
  }
  if (additional.delegation_allowed !== undefined) {
    body.delegation_allowed = additional.delegation_allowed;
  }

  return body;
}

export async function documentCreateFromPdf(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildCreateFromPdfBody.call(this);

  const additional =
    (this.getNodeParameter("additionalFields", 0, {}) || {}) as IDataObject;
  const paperlessVersion = (additional.paperless_version as string) || "";

  const headers: IDataObject | undefined = paperlessVersion
    ? { "Paperless-Version": paperlessVersion }
    : undefined;

  const credentials = await this.getCredentials("paperlessApi");
  const accessToken = credentials?.accessToken as string;

  const response = await paperlessRequest.call(this, accessToken, {
    method: "POST",
    url: API_ENDPOINTS.DOCUMENTS_CREATE,
    body,
    headers,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default documentCreateFromPdfDescription;
