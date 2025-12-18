import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";

import { API_ENDPOINTS } from "../../utils/constants";
import { paperlessRequest } from "../../utils/helpers";

export const documentGetDescription: INodeProperties[] = [
  {
    displayName: "Document ID",
    name: "documentId",
    type: "string",
    required: true,
    default: "",
    placeholder: "e.g. 123",
    displayOptions: {
      show: {
        operation: ["get"],
        resource: ["document"],
      },
    },
    description: "ID of the document to retrieve",
  },
  // Additional FIelds:
  // Expandable properties

  // The type Document contains the following expandable properties:

  //     creator
  //     blocks
  //     designs
  //     participation_flow
  //     participants
  //     tokens
];

export async function documentGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const documentId = this.getNodeParameter("documentId", 0) as string;
  if (!documentId) {
    throw new NodeOperationError(this.getNode(), "documentId is required");
  }

  const credentials = await this.getCredentials("paperlessApi");
  const accessToken = credentials?.accessToken as string;

  const response = await paperlessRequest.call(this, accessToken, {
    method: "GET",
    url: API_ENDPOINTS.DOCUMENTS_GET(documentId),
  });

  // Keep n8n output shape consistent with other operations (array of items)
  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default documentGetDescription;
