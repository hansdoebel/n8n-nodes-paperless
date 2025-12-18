import type { INodeProperties } from "n8n-workflow";
import { blobCreate, blobCreateDescription } from "./create";

export { blobCreate };

export const blobDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["blob"],
      },
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
