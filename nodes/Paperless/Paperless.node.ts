import {
  type IDataObject,
  type IExecuteFunctions,
  type IHttpRequestOptions,
  type INodeExecutionData,
  type INodeType,
  type INodeTypeDescription,
  NodeConnectionTypes,
  NodeOperationError,
} from "n8n-workflow";
import { blobDescription } from "./resources/blob";
import { documentDescription } from "./resources/document";
import { processRunsDescription } from "./resources/process_run";
import { submissionDescription } from "./resources/submission";
import { templateDescription } from "./resources/template";
import { blobCreate } from "./resources/blob/create";
import { documentCreateFromTemplate } from "./resources/document/createFromTemplate";
import { documentCreateFromPdf } from "./resources/document/createFromPdf";
import { documentCreateFromScratch } from "./resources/document/createFromScratch";
import { documentDelete } from "./resources/document/delete";
import { documentDuplicate } from "./resources/document/duplicateDocument";
import { documentUpdate } from "./resources/document/update";
import { processRunCreateFromPayload } from "./resources/process_run/createFromPayload";
import { processRunCreateFromScratch } from "./resources/process_run/createFromScratch";
import { processRunCreateFromSubmission } from "./resources/process_run/createFromSubmission";
import { submissionGet } from "./resources/submission/get";
import { templateCreate } from "./resources/template/create";
import { templateDelete } from "./resources/template/delete";
import { templateUpdate } from "./resources/template/update";

import { API_ENDPOINTS } from "./utils/constants";

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
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter("resource", 0) as string;
    const operation = this.getNodeParameter("operation", 0) as string;

    const credentials = await this.getCredentials("paperlessApi");
    const accessToken = credentials?.accessToken as string;

    try {
      if (resource === "blob") {
        if (operation === "create") {
          const res = await blobCreate.call(this);
          return [res];
        }
      } else if (resource === "document") {
        if (operation === "getCreationParameters") {
          const additional =
            (this.getNodeParameter("additionalFields", 0, {}) ||
              {}) as IDataObject;
          const body: IDataObject = {};

          if (additional.document_id && additional.template_id) {
            throw new NodeOperationError(
              this.getNode(),
              "Provide either Document ID or Template ID, not both.",
            );
          }

          if (additional.document_id) {
            body.document_id = additional.document_id;
          }
          if (additional.template_id) {
            body.template_id = additional.template_id;
          }

          const response = await this.helpers.httpRequest!(
            {
              method: "OPTIONS",
              url:
                `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DOCUMENTS_CREATION_PARAMETERS}`,
              body,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            } as unknown as IHttpRequestOptions,
          );

          return [
            this.helpers.returnJsonArray(
              Array.isArray(response) ? response : [response],
            ),
          ];
        }

        if (operation === "getAll") {
          const additional =
            (this.getNodeParameter("additionalFields", 0) || {}) as IDataObject;

          const qs: IDataObject = {};

          if (additional.page !== undefined && additional.page !== "") {
            qs.page = additional.page;
          }
          if (additional.per !== undefined && additional.per !== "") {
            qs.per_page = additional.per;
          }
          if (additional.q !== undefined && additional.q !== "") {
            qs.q = additional.q;
          }
          if (additional.sort !== undefined && additional.sort !== "") {
            qs.sort = additional.sort;
          }

          const response = await this.helpers.httpRequest!(
            <IHttpRequestOptions> {
              method: "GET",
              url:
                `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DOCUMENTS_GET_ALL}`,
              qs,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          return [
            this.helpers.returnJsonArray(
              Array.isArray(response) ? response : [response],
            ),
          ];
        }

        if (operation === "get") {
          const documentId = this.getNodeParameter("documentId", 0) as string;
          if (!documentId) {
            throw new NodeOperationError(
              this.getNode(),
              "documentId is required",
            );
          }

          const response = await this.helpers.httpRequest!(
            <IHttpRequestOptions> {
              method: "GET",
              url: `${API_ENDPOINTS.BASE_URL}${
                API_ENDPOINTS.DOCUMENTS_GET(documentId)
              }`,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          return [this.helpers.returnJsonArray([response])];
        }

        if (operation === "createFromTemplate") {
          const res = await documentCreateFromTemplate.call(this);
          return [res];
        }

        if (operation === "duplicateDocument") {
          const res = await documentDuplicate.call(this);
          return [res];
        }

        if (operation === "createFromPdf") {
          const res = await documentCreateFromPdf.call(this);
          return [res];
        }

        if (operation === "createFromScratch") {
          const res = await documentCreateFromScratch.call(this);
          return [res];
        }

        if (operation === "update") {
          const res = await documentUpdate.call(this);
          return [res];
        }

        if (operation === "delete") {
          const res = await documentDelete.call(this);
          return [res];
        }
      } else if (resource === "process_run") {
        if (operation === "createFromPayload") {
          const res = await processRunCreateFromPayload.call(this);
          return [res];
        }

        if (operation === "createFromScratch") {
          const res = await processRunCreateFromScratch.call(this);
          return [res];
        }

        if (operation === "createFromSubmission") {
          const res = await processRunCreateFromSubmission.call(this);
          return [res];
        }
      } else if (resource === "submission") {
        if (operation === "get") {
          const res = await submissionGet.call(this);
          return [res];
        }
      } else if (resource === "template") {
        if (operation === "getAll") {
          const additional =
            (this.getNodeParameter("additionalFields", 0) || {}) as IDataObject;

          const qs: IDataObject = {};

          if (additional.count === true) {
            qs.count = true;
          }
          if (
            additional.creator_id !== undefined && additional.creator_id !== ""
          ) {
            qs.creator_id = additional.creator_id;
          }
          const expandList = additional.expand as
            | IDataObject[]
            | string[]
            | undefined;
          if (Array.isArray(expandList) && expandList.length) {
            qs.expand = expandList.join(",");
          } else if (typeof expandList === "string" && expandList) {
            qs.expand = expandList;
          }
          if (additional.page !== undefined && additional.page !== "") {
            qs.page = additional.page;
          }
          if (additional.per !== undefined && additional.per !== "") {
            qs.per_page = additional.per;
          }
          if (additional.q !== undefined && additional.q !== "") {
            qs.q = additional.q;
          }
          if (additional.sort !== undefined && additional.sort !== "") {
            qs.sort = additional.sort;
          }
          if (
            additional.workspace_id !== undefined &&
            additional.workspace_id !== ""
          ) {
            qs.workspace_id = additional.workspace_id;
          }

          const response = await this.helpers.httpRequest!(
            <IHttpRequestOptions> {
              method: "GET",
              url:
                `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.TEMPLATES_GET_ALL}`,
              qs,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          return [
            this.helpers.returnJsonArray(
              Array.isArray(response) ? response : [response],
            ),
          ];
        }

        if (operation === "get") {
          const templateId = this.getNodeParameter("templateId", 0) as string;
          if (!templateId) {
            throw new NodeOperationError(
              this.getNode(),
              "templateId is required",
            );
          }
          const additional =
            (this.getNodeParameter("additionalFields", 0) || {}) as IDataObject;
          const qs: IDataObject = {};
          const expand = additional.expand as
            | IDataObject[]
            | string[]
            | undefined;
          if (Array.isArray(expand) && expand.length) {
            qs.expand = expand.join(",");
          } else if (typeof expand === "string" && expand) {
            qs.expand = expand;
          }
          if (additional.workspace_id !== undefined) {
            qs.workspace_id = additional.workspace_id;
          }

          const response = await this.helpers.httpRequest!(
            <IHttpRequestOptions> {
              method: "GET",
              url: `${API_ENDPOINTS.BASE_URL}${
                API_ENDPOINTS.TEMPLATES_GET(templateId)
              }`,
              qs,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          return [this.helpers.returnJsonArray([response])];
        }

        if (operation === "create") {
          const res = await templateCreate.call(this);
          return [res];
        }

        if (operation === "update") {
          const res = await templateUpdate.call(this);
          return [res];
        }

        if (operation === "delete") {
          const res = await templateDelete.call(this);
          return [res];
        }
      }

      return [this.helpers.returnJsonArray(returnData)];
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new NodeOperationError(this.getNode(), error.message);
      }
      throw new NodeOperationError(this.getNode(), `${error}`);
    }
  }
}
