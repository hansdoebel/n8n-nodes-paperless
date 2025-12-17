import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestOptions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { API_ENDPOINTS } from "../../utils/constants";

const showForDocumentDelete = {
  operation: ["delete"],
  resource: ["document"],
};

export const documentDeleteDescription: INodeProperties[] = [
  {
    displayName: "Document ID",
    name: "documentId",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForDocumentDelete,
    },
    description: "ID of the document to delete",
  },
];

export async function documentDelete(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const documentId = this.getNodeParameter("documentId", 0) as string;

  const credentials = await this.getCredentials("paperlessApi");
  const accessToken = credentials?.accessToken as string;

  const headers: IDataObject = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const requestOptions: IHttpRequestOptions = {
    method: "DELETE",
    baseURL: API_ENDPOINTS.BASE_URL,
    url: `${API_ENDPOINTS.DOCUMENTS_DELETE}/${documentId}`,
    headers,
  };

  const responseData = await this.helpers.httpRequest!(requestOptions);

  const executionData: INodeExecutionData = {
    json: responseData,
  };

  return [executionData];
}

export default documentDeleteDescription;
