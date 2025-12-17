import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestOptions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { API_ENDPOINTS } from "../../utils/constants";

const showForProcessRunCreateFromSubmission = {
  operation: ["createFromSubmission"],
  resource: ["process_run"],
};

export const processRunCreateFromSubmissionDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "hidden",
    default: "createFromSubmission",
  },
  {
    displayName: "Method",
    name: "method",
    type: "options",
    default: "published",
    options: [
      {
        name: "Published Version",
        value: "published",
        description: "Use published version of ProcessDefinition",
      },
      {
        name: "Specific Version",
        value: "specific",
        description: "Use specific ProcessDefinitionVersion",
      },
    ],
    displayOptions: {
      show: showForProcessRunCreateFromSubmission,
    },
  },
  {
    displayName: "Process Definition ID",
    name: "process_definition_id",
    type: "number",
    required: true,
    default: 0,
    displayOptions: {
      show: {
        ...showForProcessRunCreateFromSubmission,
        method: ["published"],
      },
    },
    typeOptions: {
      minValue: 1,
      numberPrecision: 0,
    },
    description: "ID of the ProcessDefinition",
  },
  {
    displayName: "Process Definition Version ID",
    name: "process_definition_version_id",
    type: "number",
    required: true,
    default: 0,
    displayOptions: {
      show: {
        ...showForProcessRunCreateFromSubmission,
        method: ["specific"],
      },
    },
    typeOptions: {
      minValue: 1,
      numberPrecision: 0,
    },
    description: "ID of the ProcessDefinitionVersion",
  },
  {
    displayName: "Workspace ID",
    name: "workspace_id",
    type: "number",
    required: true,
    default: 0,
    displayOptions: {
      show: showForProcessRunCreateFromSubmission,
    },
    typeOptions: {
      minValue: 1,
      numberPrecision: 0,
    },
    description: "ID of the workspace",
  },
  {
    displayName: "Submission ID",
    name: "submission_id",
    type: "number",
    required: true,
    default: 0,
    displayOptions: {
      show: showForProcessRunCreateFromSubmission,
    },
    typeOptions: {
      minValue: 1,
      numberPrecision: 0,
    },
    description: "ID of the submission",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForProcessRunCreateFromSubmission,
    },
    options: [
      {
        displayName: "Custom Data",
        name: "custom_data",
        type: "json",
        default: "{}",
        description: "Custom data object",
      },
      {
        displayName: "Label Slugs",
        name: "label_slugs",
        type: "string",
        default: "",
        description: "Comma-separated label slugs (pattern: ^[a-zA-Z0-9_]+$)",
      },
      {
        displayName: "State",
        name: "state",
        type: "string",
        default: "",
        description: "State of the process run",
      },
      {
        displayName: "Test Run",
        name: "test_run",
        type: "boolean",
        default: false,
        description: "Whether this is a test run",
      },
    ],
  },
];

function buildCreateFromSubmissionBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};
  const method = this.getNodeParameter("method", 0) as string;

  if (method === "published") {
    body.process_definition_id = this.getNodeParameter(
      "process_definition_id",
      0,
    ) as number;
  } else {
    body.process_definition_version_id = this.getNodeParameter(
      "process_definition_version_id",
      0,
    ) as number;
  }

  body.workspace_id = this.getNodeParameter("workspace_id", 0) as number;
  body.submission_id = this.getNodeParameter("submission_id", 0) as number;

  const additional =
    (this.getNodeParameter("additionalFields", 0, {}) || {}) as IDataObject;

  if (additional.test_run !== undefined) {
    body.test_run = additional.test_run;
  }
  if (additional.state) {
    body.state = additional.state;
  }
  if (additional.label_slugs) {
    const labelSlugs = (additional.label_slugs as string)
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    if (labelSlugs.length) {
      body.label_slugs = labelSlugs;
    }
  }
  if (additional.custom_data) {
    try {
      body.custom_data = typeof additional.custom_data === "string"
        ? JSON.parse(additional.custom_data)
        : additional.custom_data;
    } catch {
      body.custom_data = additional.custom_data;
    }
  }

  return body;
}

export async function processRunCreateFromSubmission(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildCreateFromSubmissionBody.call(this);

  const credentials = await this.getCredentials("paperlessApi");
  const accessToken = credentials?.accessToken as string;

  const headers: IDataObject = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const requestOptions: IHttpRequestOptions = {
    method: "POST",
    baseURL: API_ENDPOINTS.BASE_URL,
    url: API_ENDPOINTS.PROCESS_RUNS_CREATE,
    body,
    headers,
  };

  const responseData = await this.helpers.httpRequest!(requestOptions);

  const executionData: INodeExecutionData = {
    json: responseData,
  };

  return [executionData];
}

export default processRunCreateFromSubmissionDescription;
