import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";

import { API_ENDPOINTS } from "../../utils/constants";
import { buildQs, paperlessRequest } from "../../utils/helpers";

export const submissionGetDescription: INodeProperties[] = [
  {
    displayName: "Submission ID",
    name: "submission_id",
    type: "number",
    required: true,
    default: 0,
    displayOptions: {
      show: {
        operation: ["get"],
        resource: ["submission"],
      },
    },
    typeOptions: {
      minValue: 1,
      numberPrecision: 0,
    },
    description: "ID of the submission",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        operation: ["get"],
        resource: ["submission"],
      },
    },
    options: [
      {
        displayName: "Disposition",
        name: "disposition",
        type: "options",
        default: "inline",
        options: [
          { name: "Attachment", value: "attachment" },
          { name: "Inline", value: "inline" },
        ],
        description: "How the submission should be displayed",
      },
      {
        displayName: "Expand",
        name: "expand",
        type: "multiOptions",
        default: [],
        options: [
          { name: "Blob", value: "blob" },
          { name: "Document", value: "document" },
          { name: "Manifest", value: "manifest" },
          { name: "Pages", value: "pages" },
        ],
        description: "Fields to expand in the response",
      },
    ],
  },
];

export async function submissionGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const submissionId = this.getNodeParameter("submission_id", 0) as number;
  if (!submissionId) {
    throw new NodeOperationError(this.getNode(), "submission_id is required");
  }

  const additional =
    (this.getNodeParameter("additionalFields", 0, {}) || {}) as IDataObject;

  const qs = buildQs(additional, {
    disposition: "disposition",
    expand: "expand",
  });

  const credentials = await this.getCredentials("paperlessApi");
  const accessToken = credentials?.accessToken as string;

  const response = await paperlessRequest.call(this, accessToken, {
    method: "GET",
    url: API_ENDPOINTS.SUBMISSIONS_GET(submissionId.toString()),
    qs,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default submissionGetDescription;
