import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestOptions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { API_ENDPOINTS } from "../../utils/constants";

const showForSubmissionGet = {
  operation: ["get"],
  resource: ["submission"],
};

export const submissionGetDescription: INodeProperties[] = [
  {
    displayName: "Submission ID",
    name: "submission_id",
    type: "number",
    required: true,
    default: 0,
    displayOptions: {
      show: showForSubmissionGet,
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
      show: showForSubmissionGet,
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
  const additional =
    (this.getNodeParameter("additionalFields", 0, {}) || {}) as IDataObject;

  const credentials = await this.getCredentials("paperlessApi");
  const accessToken = credentials?.accessToken as string;

  const qs: IDataObject = {};

  if (additional.disposition) {
    qs.disposition = additional.disposition;
  }

  const expandList = additional.expand as string[] | undefined;
  if (Array.isArray(expandList) && expandList.length) {
    qs.expand = expandList.join(",");
  }

  const headers: IDataObject = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const requestOptions: IHttpRequestOptions = {
    method: "GET",
    baseURL: API_ENDPOINTS.BASE_URL,
    url: API_ENDPOINTS.SUBMISSIONS_GET(submissionId.toString()),
    qs,
    headers,
  };

  const responseData = await this.helpers.httpRequest!(requestOptions);

  const executionData: INodeExecutionData = {
    json: responseData,
  };

  return [executionData];
}

export default submissionGetDescription;
