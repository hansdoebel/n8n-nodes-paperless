import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";

import { API_ENDPOINTS } from "../../utils/constants";
import { buildQs, paperlessRequest } from "../../utils/helpers";

export const templateGetDescription: INodeProperties[] = [
  {
    displayName: "Template ID",
    name: "templateId",
    type: "string",
    required: true,
    default: "",
    placeholder: "e.g. 311",
    description: "ID of the template to retrieve",
    displayOptions: {
      show: {
        operation: ["get"],
        resource: ["template"],
      },
    },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    displayOptions: {
      show: {
        operation: ["get"],
        resource: ["template"],
      },
    },
    default: {},
    options: [
      {
        displayName: "Disposition",
        name: "disposition",
        type: "options",
        default: "inline",
        options: [
          {
            name: "Inline",
            value: "inline",
          },
          {
            name: "Attachment",
            value: "attachment",
          },
        ],
        description: "How to return the response",
      },
      // {
      //   displayName: "Expand",
      //   name: "expand",
      //   type: "multiOptions",
      //   default: [],
      //   options: [],
      //   description:
      //     "Related resources to expand in the response (depends on API support)",
      //   routing: {
      //     send: {
      //       type: "query",
      //       property: "expand",
      //     },
      //   },
      // },
      //
      //
      // Expandable properties
      // The type Template contains the following expandable properties:
      //
      //     creator
      //     designs
      //     participants
      //     participation_flow
      //     tokens
      //     blocks
    ],
  },
];

export async function templateGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const templateId = this.getNodeParameter("templateId", 0) as string;
  if (!templateId) {
    throw new NodeOperationError(this.getNode(), "templateId is required");
  }

  const additional =
    (this.getNodeParameter("additionalFields", 0, {}) || {}) as IDataObject;

  const qs = buildQs(additional, {
    expand: "expand",
    workspace_id: "workspace_id",
  });

  const credentials = await this.getCredentials("paperlessApi");
  const accessToken = credentials?.accessToken as string;

  const response = await paperlessRequest.call(this, accessToken, {
    method: "GET",
    url: API_ENDPOINTS.TEMPLATES_GET(templateId),
    qs,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default templateGetDescription;
