import type { INodeProperties } from "n8n-workflow";

const showForDocumentGetMany = {
  operation: ["getAll"],
  resource: ["document"],
};

export const documentGetManyDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    displayOptions: { show: showForDocumentGetMany },
    default: {},
    options: [
      {
        displayName: "Archived",
        name: "archived",
        type: "boolean",
        default: false,
        description: "Whether to filter by archived status",
      },
      {
        displayName: "Count",
        name: "count",
        type: "boolean",
        default: false,
        description: "Whether to return the total number of documents",
      },
      {
        displayName: "Creator ID",
        name: "creator_id",
        type: "string",
        default: "",
        description: "Filter by creator ID",
      },
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
        description: "Number of documents per page",
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
        displayName: "Template ID",
        name: "template_id",
        type: "string",
        default: "",
        description: "Filter by template ID",
      },
      {
        displayName: "Workspace ID",
        name: "workspace_id",
        type: "string",
        default: "",
        description: "Filter by workspace ID",
      },
    ],
  },
];

export default documentGetManyDescription;
