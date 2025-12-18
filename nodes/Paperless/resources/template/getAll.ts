import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../utils/constants";
import { buildQs, paperlessRequest } from "../../utils/helpers";

export const templateGetManyDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    displayOptions: {
      show: {
        operation: ["getAll"],
        resource: ["template"],
      },
    },
    default: {},
    options: [
      {
        displayName: "Count",
        name: "count",
        type: "boolean",
        default: false,
        description: "Whether to return the total number of templates",
      },
      {
        displayName: "Creator ID",
        name: "creator_id",
        type: "number",
        default: "",
        placeholder: "e.g. 2508",
        typeOptions: {
          minValue: 1,
          numberPrecision: 0,
        },
        description: "Only return templates created by this user ID",
      },
      // {
      //   displayName: "Expand",
      //   name: "expand",
      //   type: "multiOptions",
      //   default: [],
      //   options: [],
      //   description:
      //     "Related resources to expand in the response (depends on API support)",
      // },
      //
      // Expandable properties
      // The type Template contains the following expandable properties:

      //     creator
      //     designs
      //     participants
      //     participation_flow
      //     tokens
      //     blocks
      {
        displayName: "Page",
        name: "page",
        type: "number",
        default: 1,
        typeOptions: {
          minValue: 1,
          numberPrecision: 0,
        },
        description: "Page number for pagination",
      },
      {
        displayName: "Per Page",
        name: "per",
        type: "number",
        default: 25,
        typeOptions: {
          minValue: 1,
          maxValue: 100,
          numberPrecision: 0,
        },
        description: "Number of templates per page",
      },
      {
        displayName: "Query",
        name: "q",
        type: "string",
        default: "",
        description: "Search query",
      },
      {
        displayName: "Sort",
        name: "sort",
        type: "string",
        default: "",
        description: "Sort field(s), as supported by the API",
      },
      {
        displayName: "Workspace ID",
        name: "workspace_id",
        type: "number",
        default: "",
        placeholder: "e.g. 1206",
        typeOptions: {
          minValue: 1,
          numberPrecision: 0,
        },
        description: "Only return templates from this workspace ID",
      },
    ],
  },
];

export async function templateGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const additional =
    (this.getNodeParameter("additionalFields", 0, {}) || {}) as IDataObject;

  const qs = buildQs(additional, {
    count: "count",
    creator_id: "creator_id",
    expand: "expand",
    page: "page",
    per: (v: unknown) => ["per_page", v],
    q: "q",
    sort: "sort",
    workspace_id: "workspace_id",
  });

  const credentials = await this.getCredentials("paperlessApi");
  const accessToken = credentials?.accessToken as string;

  const response = await paperlessRequest.call(this, accessToken, {
    method: "GET",
    url: API_ENDPOINTS.TEMPLATES_GET_ALL,
    qs,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
