import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";

import { API_ENDPOINTS } from "../../utils/constants";
import { paperlessRequest } from "../../utils/helpers";

const showForDocumentGetCreationParameters = {
  operation: ["getCreationParameters"],
  resource: ["document"],
};

export const documentGetCreationParametersDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForDocumentGetCreationParameters,
    },
    options: [
      {
        displayName: "Document ID",
        name: "document_id",
        type: "number",
        default: "",
        description:
          "Base the parameter options on an existing document (mutually exclusive with Template ID)",
      },
      {
        displayName: "Template ID",
        name: "template_id",
        type: "number",
        default: "",
        description:
          "Base the parameter options on a template (mutually exclusive with Document ID)",
      },
    ],
  },
];

export async function documentGetCreationParameters(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const additional =
    (this.getNodeParameter("additionalFields", 0, {}) || {}) as IDataObject;

  if (additional.document_id && additional.template_id) {
    throw new NodeOperationError(
      this.getNode(),
      "Provide either Document ID or Template ID, not both.",
    );
  }

  const body: IDataObject = {};
  if (additional.document_id) body.document_id = additional.document_id;
  if (additional.template_id) body.template_id = additional.template_id;

  const credentials = await this.getCredentials("paperlessApi");
  const accessToken = credentials?.accessToken as string;

  const response = await paperlessRequest.call(this, accessToken, {
    // Some n8n versions/types don't include "OPTIONS" in IHttpRequestMethods.
    // The Paperless endpoint supports OPTIONS for introspection, so we keep it at runtime.
    method: "OPTIONS" as unknown as "GET",
    url: API_ENDPOINTS.DOCUMENTS_CREATION_PARAMETERS,
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default documentGetCreationParametersDescription;
