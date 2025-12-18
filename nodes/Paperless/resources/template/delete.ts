import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";
import { paperlessRequest } from "../../utils/helpers";

export const templateDeleteDescription: INodeProperties[] = [
  {
    displayName: "Template ID",
    name: "templateId",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: {
        operation: ["delete"],
        resource: ["template"],
      },
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
      show: {
        operation: ["delete"],
        resource: ["template"],
      },
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
  if (!templateId) {
    throw new NodeOperationError(this.getNode(), "templateId is required");
  }

  const additional =
    (this.getNodeParameter("additionalFields", 0, {}) || {}) as IDataObject;

  const expand = (additional.expand as string[]) || [];
  const qs: IDataObject = {};
  if (Array.isArray(expand) && expand.length) {
    qs.expand = expand.join(",");
  }

  const paperlessVersion = (additional.paperless_version as string) || "";
  const headers: IDataObject | undefined = paperlessVersion
    ? { "Paperless-Version": paperlessVersion }
    : undefined;

  const credentials = await this.getCredentials("paperlessApi");
  const accessToken = credentials?.accessToken as string;

  const response = await paperlessRequest.call(this, accessToken, {
    method: "DELETE",
    url: `/templates/${templateId}`,
    qs,
    headers,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default templateDeleteDescription;
