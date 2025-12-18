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
    displayName: "Filename",
    name: "filename",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForBlobCreate,
    },
    description: "Name of the file including extension (e.g., document.pdf)",
    placeholder: "e.g. document.pdf",
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
    description:
      "Exact size of the file in bytes (max 128MB). Must match the actual file size exactly.",
  },
  {
    displayName: "Content Type",
    name: "content_type",
    type: "options",
    required: true,
    default: "application/pdf",
    displayOptions: {
      show: showForBlobCreate,
    },
    options: [
      {
        name: "Custom",
        value: "custom",
      },
      {
        name: "GIF Image",
        value: "image/gif",
      },
      {
        name: "JPEG Image",
        value: "image/jpeg",
      },
      {
        name: "Microsoft Excel (XLSX)",
        value:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      {
        name: "Microsoft PowerPoint (PPTX)",
        value:
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      },
      {
        name: "Microsoft Word (DOCX)",
        value:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
      {
        name: "PDF",
        value: "application/pdf",
      },
      {
        name: "Plain Text",
        value: "text/plain",
      },
      {
        name: "PNG Image",
        value: "image/png",
      },
      {
        name: "RTF",
        value: "application/rtf",
      },
      {
        name: "TIFF Image",
        value: "image/tiff",
      },
      {
        name: "ZIP Archive",
        value: "application/zip",
      },
    ],
    description:
      "MIME type of the file. Select 'Custom' to enter a different MIME type.",
  },
  {
    displayName: "Custom Content Type",
    name: "custom_content_type",
    type: "string",
    default: "",
    displayOptions: {
      show: {
        ...showForBlobCreate,
        content_type: ["custom"],
      },
    },
    placeholder: "e.g. application/vnd.custom",
    description: "Enter the MIME type for your file",
  },
  {
    displayName: "Checksum (MD5)",
    name: "checksum",
    type: "string",
    default: "string",
    displayOptions: {
      show: showForBlobCreate,
    },
    description:
      "Optional: Base64 encoded MD5 checksum of the file for data integrity verification. Leave empty to skip validation.",
    placeholder: "e.g. rL0Y20zC+Fzt72VPzMSk2A==",
  },
  {
    displayName:
      "This operation is for advanced use cases where you need to prepare blob metadata. For file uploads, use the AWS S3 node or HTTP node with the direct_upload URL returned here.",
    name: "notice",
    type: "notice",
    default: "",
    displayOptions: {
      show: showForBlobCreate,
    },
  },
];

function buildBlobCreateBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  body.filename = this.getNodeParameter("filename", 0) as string;
  body.byte_size = this.getNodeParameter("byte_size", 0) as number;

  const contentType = this.getNodeParameter("content_type", 0) as string;
  if (contentType === "custom") {
    body.content_type = this.getNodeParameter(
      "custom_content_type",
      0,
    ) as string;
  } else {
    body.content_type = contentType;
  }

  const checksum = this.getNodeParameter("checksum", 0) as string;
  if (checksum) {
    body.checksum = checksum;
  }

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
