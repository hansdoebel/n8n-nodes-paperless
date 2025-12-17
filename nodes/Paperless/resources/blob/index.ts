import type { INodeProperties } from "n8n-workflow";
import { blobCreateDescription } from "./create";

const showOnlyForBlob = {
  resource: ["blob"],
};

export const blobDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: showOnlyForBlob,
    },
    options: [
      {
        name: "Create",
        value: "create",
        description: "Create a new blob",
        action: "Create a blob",
      },
    ],
    default: "create",
  },
  ...blobCreateDescription,
];
