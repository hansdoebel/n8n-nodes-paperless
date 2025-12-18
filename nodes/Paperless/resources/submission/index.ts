import type { INodeProperties } from "n8n-workflow";
import { submissionGet, submissionGetDescription } from "./get";

export { submissionGet };

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
