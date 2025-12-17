import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestOptions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { API_ENDPOINTS } from "../../utils/constants";

const showForBlobCreate = {
  operation: ["create"],
  resource: ["blob"],
};

export const blobCreateDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "hidden",
    default: "create",
  },
  {
    displayName: "Filename",
    name: "filename",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForBlobCreate,
    },
    description: "Name of the file",
  },
  {
    displayName: "Byte Size",
    name: "byte_size",
    type: "number",
    required: true,
    default: 0,
    displayOptions: {
      show: showForBlobCreate,
    },
    typeOptions: {
      minValue: 1,
      maxValue: 128000000,
      numberPrecision: 0,
    },
    description: "Size of the file in bytes (max 128MB)",
  },
  {
    displayName: "Checksum",
    name: "checksum",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForBlobCreate,
    },
    description: "Base64 encoded MD5 checksum of the file",
  },
  {
    displayName: "Content Type",
    name: "content_type",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForBlobCreate,
    },
    description: "MIME-Type of the file",
  },
];

function buildBlobCreateBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  body.filename = this.getNodeParameter("filename", 0) as string;
  body.byte_size = this.getNodeParameter("byte_size", 0) as number;
  body.checksum = this.getNodeParameter("checksum", 0) as string;
  body.content_type = this.getNodeParameter("content_type", 0) as string;

  return body;
}

export async function blobCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildBlobCreateBody.call(this);

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
    url: API_ENDPOINTS.BLOBS_CREATE,
    body,
    headers,
  };

  const responseData = await this.helpers.httpRequest!(requestOptions);

  const executionData: INodeExecutionData = {
    json: responseData,
  };

  return [executionData];
}

export default blobCreateDescription;
