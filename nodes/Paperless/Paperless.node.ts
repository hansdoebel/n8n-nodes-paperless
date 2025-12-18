import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeType,
  type INodeTypeDescription,
  NodeConnectionTypes,
  NodeOperationError,
} from "n8n-workflow";
import { API_ENDPOINTS } from "./utils/constants";
import { blobCreate, blobDescription } from "./resources/blob";
import {
  documentCreateFromPdf,
  documentCreateFromScratch,
  documentCreateFromTemplate,
  documentDelete,
  documentDescription,
  documentDuplicate,
  documentGet,
  documentGetAll,
  documentGetCreationParameters,
  documentUpdate,
} from "./resources/document";
import {
  processRunCreateFromPayload,
  processRunCreateFromScratch,
  processRunCreateFromSubmission,
  processRunsDescription,
} from "./resources/process_run";
import { submissionDescription, submissionGet } from "./resources/submission";
import {
  templateCreate,
  templateDelete,
  templateDescription,
  templateGet,
  templateGetAll,
  templateUpdate,
} from "./resources/template";

export class Paperless implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Paperless",
    name: "paperless",
    icon: "file:paperless.svg",

    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: "Interact with the Paperless API",
    defaults: {
      name: "Paperless",
    },
    usableAsTool: true,
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [{ name: "paperlessApi", required: true }],
    requestDefaults: {
      baseURL: API_ENDPOINTS.BASE_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
    properties: [
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        noDataExpression: true,
        options: [
          {
            name: "Blob",
            value: "blob",
          },
          {
            name: "Document",
            value: "document",
          },
          {
            name: "Process Run",
            value: "process_run",
          },
          {
            name: "Submission",
            value: "submission",
          },
          {
            name: "Template",
            value: "template",
          },
        ],
        default: "document",
      },
      ...blobDescription,
      ...documentDescription,
      ...processRunsDescription,
      ...submissionDescription,
      ...templateDescription,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const resource = this.getNodeParameter("resource", 0) as string;
    const operation = this.getNodeParameter("operation", 0) as string;

    await this.getCredentials("paperlessApi");

    const handlers: Record<
      string,
      Record<string, (this: IExecuteFunctions) => Promise<INodeExecutionData[]>>
    > = {
      blob: {
        create: blobCreate,
      },
      document: {
        getCreationParameters: documentGetCreationParameters,
        getAll: documentGetAll,
        get: documentGet,
        createFromTemplate: documentCreateFromTemplate,
        duplicateDocument: documentDuplicate,
        createFromPdf: documentCreateFromPdf,
        createFromScratch: documentCreateFromScratch,
        update: documentUpdate,
        delete: documentDelete,
      },
      process_run: {
        createFromPayload: processRunCreateFromPayload,
        createFromScratch: processRunCreateFromScratch,
        createFromSubmission: processRunCreateFromSubmission,
      },
      submission: {
        get: submissionGet,
      },
      template: {
        getAll: templateGetAll,
        get: templateGet,
        create: templateCreate,
        update: templateUpdate,
        delete: templateDelete,
      },
    };

    try {
      const handler = handlers[resource]?.[operation];
      if (!handler) {
        throw new NodeOperationError(
          this.getNode(),
          `Unsupported operation "${operation}" for resource "${resource}"`,
        );
      }

      const res = await handler.call(this);
      return [res];
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new NodeOperationError(this.getNode(), error.message);
      }
      throw new NodeOperationError(this.getNode(), `${error}`);
    }
  }
}
