import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestOptions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { API_ENDPOINTS } from "../../utils/constants";

const showForTemplateDelete = {
  operation: ["delete"],
  resource: ["template"],
};

export const templateDeleteDescription: INodeProperties[] = [
  {
    displayName: "Template ID",
    name: "templateId",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForTemplateDelete,
    },
    description: "ID of the template to delete",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForTemplateDelete,
    },
    options: [
      {
        displayName: "Expand",
        name: "expand",
        type: "multiOptions",
        default: [],
        options: [
          { name: "Blocks", value: "blocks" },
          { name: "Creator", value: "creator" },
          { name: "Designs", value: "designs" },
          { name: "Participants", value: "participants" },
          { name: "Participation Flow", value: "participation_flow" },
          { name: "Tokens", value: "tokens" },
        ],
        description: "Related resources to expand in the response",
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
    ],
  },
];

export async function templateDelete(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const templateId = this.getNodeParameter("templateId", 0) as string;

  const additional =
    (this.getNodeParameter("additionalFields", 0, {}) || {}) as IDataObject;

  const expand = (additional.expand as string[]) || [];
  const qs: IDataObject = {};
  if (Array.isArray(expand) && expand.length) {
    qs.expand = expand.join(",");
  }

  const paperlessVersion = (additional.paperless_version as string) || "";

  // Get credentials for Authorization header
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
    url: `/templates/${templateId}`,
    qs,
    headers,
  };

  if (paperlessVersion) {
    headers["Paperless-Version"] = paperlessVersion;
  }

  const responseData = await this.helpers.httpRequest!(requestOptions);

  const executionData: INodeExecutionData = {
    json: responseData,
  };

  return [executionData];
}

export default templateDeleteDescription;
