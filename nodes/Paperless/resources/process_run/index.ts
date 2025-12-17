import type { INodeProperties } from "n8n-workflow";
import { processRunCreateFromScratchDescription } from "./createFromScratch";
import { processRunCreateFromSubmissionDescription } from "./createFromSubmission";
import { processRunCreateFromPayloadDescription } from "./createFromPayload";

const showOnlyForProcessRun = {
  resource: ["process_run"],
};

export const processRunsDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: showOnlyForProcessRun,
    },
    options: [
      {
        name: "Create From Payload",
        value: "createFromPayload",
        description: "Create process run from custom input payload",
        action: "Create process run from payload",
      },
      {
        name: "Create From Scratch",
        value: "createFromScratch",
        description: "Create process run from scratch",
        action: "Create process run from scratch",
      },
      {
        name: "Create From Submission",
        value: "createFromSubmission",
        description: "Create process run from submission",
        action: "Create process run from submission",
      },
    ],
    default: "createFromScratch",
  },
  ...processRunCreateFromPayloadDescription,
  ...processRunCreateFromScratchDescription,
  ...processRunCreateFromSubmissionDescription,
];
