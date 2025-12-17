import type { INodeProperties } from "n8n-workflow";

const showForDocumentGetCreationParameters = {
  operation: ["getCreationParameters"],
  resource: ["document"],
};

export const documentGetCreationParametersDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForDocumentGetCreationParameters,
    },
    options: [
      {
        displayName: "Document ID",
        name: "document_id",
        type: "number",
        default: "",
        description:
          "Base the parameter options on an existing document (mutually exclusive with Template ID)",
      },
      {
        displayName: "Template ID",
        name: "template_id",
        type: "number",
        default: "",
        description:
          "Base the parameter options on a template (mutually exclusive with Document ID)",
      },
    ],
  },
];

export default documentGetCreationParametersDescription;
