import type { INodeProperties } from "n8n-workflow";

const showForDocumentGet = {
  operation: ["get"],
  resource: ["document"],
};

export const documentGetDescription: INodeProperties[] = [
  {
    displayName: "Document ID",
    name: "documentId",
    type: "string",
    required: true,
    default: "",
    placeholder: "e.g. 123",
    displayOptions: {
      show: showForDocumentGet,
    },
    description: "ID of the document to retrieve",
  },
  // Additional FIelds:
  // Expandable properties

  // The type Document contains the following expandable properties:

  //     creator
  //     blocks
  //     designs
  //     participation_flow
  //     participants
  //     tokens
];

export default documentGetDescription;
