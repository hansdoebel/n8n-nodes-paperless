import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";

import { API_ENDPOINTS } from "../../utils/constants";
import { paperlessRequest } from "../../utils/helpers";

export const documentUpdateDescription: INodeProperties[] = [
  {
    displayName: "Document ID",
    name: "documentId",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: {
        operation: ["update"],
        resource: ["document"],
      },
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
      show: {
        operation: ["update"],
        resource: ["document"],
      },
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
        description: "New description for the document",
      },
      {
        displayName: "Forwarding Allowed",
        name: "forwarding_allowed",
        type: "boolean",
        default: false,
        description: "Whether forwarding is allowed",
      },
      {
        displayName: "Name",
        name: "name",
        type: "string",
        default: "",
        description: "New name for the document",
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
        displayName: "Rendering Locale",
        name: "rendering_locale",
        type: "string",
        default: "",
        description: "New rendering locale (e.g. en-US)",
      },
      {
        displayName: "State",
        name: "state",
        type: "string",
        default: "",
        description: "New state for the document (API dependent)",
      },
    ],
  },
];

export async function documentUpdate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const documentId = this.getNodeParameter("documentId", 0) as string;
  if (!documentId) {
    throw new NodeOperationError(this.getNode(), "documentId is required");
  }

  const additional =
    (this.getNodeParameter("additionalFields", 0, {}) || {}) as IDataObject;

  const body: IDataObject = {};

  const allowed = [
    "name",
    "description",
    "state",
    "rendering_locale",
    "forwarding_allowed",
    "delegation_allowed",
  ] as const;

  for (const key of allowed) {
    if (additional[key] !== undefined && additional[key] !== "") {
      body[key] = additional[key];
    }
  }

  const paperlessVersion = (additional.paperless_version as string) || "";
  const headers: IDataObject | undefined = paperlessVersion
    ? { "Paperless-Version": paperlessVersion }
    : undefined;

  const credentials = await this.getCredentials("paperlessApi");
  const accessToken = credentials?.accessToken as string;

  const updateEndpoint = (API_ENDPOINTS as Partial<
    typeof API_ENDPOINTS & {
      DOCUMENTS_UPDATE: string | ((id: string) => string);
    }
  >).DOCUMENTS_UPDATE;

  const endpoint = typeof updateEndpoint === "function"
    ? updateEndpoint(documentId)
    : updateEndpoint ?? API_ENDPOINTS.DOCUMENTS_GET(documentId);

  const response = await paperlessRequest.call(this, accessToken, {
    method: "PATCH",
    url: endpoint,
    body,
    headers,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default documentUpdateDescription;
