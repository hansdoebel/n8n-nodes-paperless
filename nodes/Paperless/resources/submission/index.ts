import type { INodeProperties } from "n8n-workflow";
import { submissionGetDescription } from "./get";

const showOnlyForSubmission = {
  resource: ["submission"],
};

export const submissionDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: showOnlyForSubmission,
    },
    options: [
      {
        name: "Get",
        value: "get",
        description: "Get submission by ID",
        action: "Get submission",
      },
    ],
    default: "get",
  },
  ...submissionGetDescription,
];
