// Docs: https://developers.paperless.io/docs/api/d65d979d4a988-create-a-new-document

import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestOptions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { API_ENDPOINTS } from "../../utils/constants";

const showForDocumentCreate = {
  operation: ["create"],
  resource: ["document"],
};

export const documentCreateDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForDocumentCreate,
    },
    options: [
      {
        displayName: "Template ID",
        name: "template_id",
        type: "number",
        default: 0,
        displayOptions: {
          show: showForDocumentCreate,
        },
        typeOptions: {
          minValue: 1,
          numberPrecision: 0,
        },
        description: "ID of the template to use for document creation",
      },
      {
        displayName: "Document ID",
        name: "document_id",
        type: "number",
        default: 0,
        displayOptions: {
          show: showForDocumentCreate,
        },
        typeOptions: {
          minValue: 1,
          numberPrecision: 0,
        },
        description: "ID of the template to use for document creation",
      },
      // Expandable properties

      // The type Document contains the following expandable properties:

      //     creator
      //     blocks
      //     designs
      //     participation_flow
      //     participants
      //     tokens
    ],
  },
];

function buildCreateBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  const templateId = this.getNodeParameter("template_id", 0) as string;
  body.template_id = templateId;

  return body;
}

export async function documentCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildCreateBody.call(this);

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

export default documentCreateDescription;
