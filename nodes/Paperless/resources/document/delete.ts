import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";

import { API_ENDPOINTS } from "../../utils/constants";
import { paperlessRequest } from "../../utils/helpers";

export const documentDeleteDescription: INodeProperties[] = [
  {
    displayName: "Document ID",
    name: "documentId",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: { operation: ["delete"], resource: ["document"] },
    },
    description: "ID of the document to delete",
  },
];

export async function documentDelete(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const documentId = this.getNodeParameter("documentId", 0) as string;
  if (!documentId) {
    throw new NodeOperationError(this.getNode(), "documentId is required");
  }

  const credentials = await this.getCredentials("paperlessApi");
  const accessToken = credentials?.accessToken as string;

  const deleteEndpoint = (API_ENDPOINTS as Partial<
    typeof API_ENDPOINTS & {
      DOCUMENTS_DELETE: string | ((id: string) => string);
    }
  >).DOCUMENTS_DELETE;

  const endpoint = typeof deleteEndpoint === "function"
    ? deleteEndpoint(documentId)
    : deleteEndpoint ?? API_ENDPOINTS.DOCUMENTS_GET(documentId);

  const response = await paperlessRequest.call(this, accessToken, {
    method: "DELETE",
    url: endpoint,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default documentDeleteDescription;
