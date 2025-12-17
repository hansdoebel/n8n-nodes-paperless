import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestOptions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { API_ENDPOINTS } from "../../utils/constants";

const showForDocumentUpdate = {
  operation: ["update"],
  resource: ["document"],
};

export const documentUpdateDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "hidden",
    default: "update",
  },
  {
    displayName: "Document ID",
    name: "documentId",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForDocumentUpdate,
    },
    description: "ID of the document to update",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForDocumentUpdate,
    },
    options: [
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
    ],
  },
];

export async function documentUpdate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const documentId = this.getNodeParameter("documentId", 0) as string;
  const additional =
    (this.getNodeParameter("additionalFields", 0, {}) || {}) as IDataObject;

  const body: IDataObject = {};

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
    url: `${API_ENDPOINTS.DOCUMENTS_UPDATE}/${documentId}`,
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

export default documentUpdateDescription;
