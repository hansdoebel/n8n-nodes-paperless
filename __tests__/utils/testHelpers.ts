import type {
  ICredentialDataDecryptedObject,
  IDataObject,
  IExecuteFunctions,
  IHttpRequestOptions,
  INode,
  INodeParameters,
} from "n8n-workflow";

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function getActualUrl(actualCall: IHttpRequestOptions): string | undefined {
  if (!actualCall.url) return undefined;
  const url = actualCall.url;
  if (isAbsoluteUrl(url)) return url;

  const baseURL = actualCall.baseURL;
  if (!baseURL) return url;

  return `${baseURL.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
}

function matchesExpectedUrl(
  actualCall: IHttpRequestOptions,
  expectedUrl: string,
): boolean {
  const expected = normalizeUrl(expectedUrl);

  const actualRaw = actualCall.url ? normalizeUrl(actualCall.url) : undefined;
  const actualFull = getActualUrl(actualCall)
    ? normalizeUrl(getActualUrl(actualCall)!)
    : undefined;

  if (!actualRaw && !actualFull) return false;

  if (isAbsoluteUrl(expected)) {
    return actualFull === expected;
  }

  return actualRaw === expected || actualFull === expected;
}

/**
 * Creates a mock IExecuteFunctions context for testing n8n nodes
 */
export function createMockExecuteFunctions(
  parameters: Record<string, unknown> = {},
  credentials: ICredentialDataDecryptedObject = {},
): IExecuteFunctions {
  const nodeParameters = new Map<string, unknown>(Object.entries(parameters));

  const mockHttpRequest = jest.fn();
  const mockGetCredentials = jest.fn().mockResolvedValue(credentials);
  const mockGetNodeParameter = jest.fn(
    (parameterName: string, itemIndex: number, fallback?: unknown) => {
      const key = `${parameterName}`;
      if (nodeParameters.has(key)) {
        return nodeParameters.get(key);
      }

      // Handle nested parameter names like "additionalFields.expand"
      if (parameterName.includes(".")) {
        const parts = parameterName.split(".");
        let value: any = parameters;
        for (const part of parts) {
          if (value && typeof value === "object" && part in value) {
            value = (value as any)[part];
          } else {
            return fallback;
          }
        }
        return value;
      }

      return fallback;
    },
  );
  const mockReturnJsonArray = jest.fn((items: IDataObject[]) => {
    return items.map((item) => ({ json: item }));
  });

  const mockNode: INode = {
    id: "test-node-id",
    name: "Test Paperless Node",
    type: "n8n-nodes-paperless.paperless",
    typeVersion: 1,
    position: [0, 0],
    parameters: parameters as INodeParameters,
  };

  const mockContext: Partial<IExecuteFunctions> = {
    getNodeParameter: mockGetNodeParameter as any,
    getCredentials: mockGetCredentials,
    getNode: () => mockNode,
    helpers: {
      httpRequest: mockHttpRequest,
      returnJsonArray: mockReturnJsonArray,
    } as any,
    continueOnFail: () => false,
    getExecutionId: () => "test-execution-id",
    getWorkflow: () =>
      ({
        id: "test-workflow-id",
        name: "Test Workflow",
        active: true,
        nodes: [],
        connections: {},
        settings: {},
      }) as any,
  };

  return mockContext as IExecuteFunctions;
}

/**
 * Mock credentials for Paperless API
 */
export function createMockCredentials(
  accessToken = "test-access-token",
): ICredentialDataDecryptedObject {
  return {
    accessToken,
  };
}

/**
 * Asserts that an HTTP request was made with expected options
 */
export function assertHttpRequest(
  mockFn: jest.Mock,
  expectedOptions: Partial<IHttpRequestOptions>,
) {
  expect(mockFn).toHaveBeenCalled();
  const actualCall = mockFn.mock.calls[0][0] as IHttpRequestOptions;

  if (expectedOptions.method) {
    expect(actualCall.method).toBe(expectedOptions.method);
  }

  if (expectedOptions.url) {
    expect(matchesExpectedUrl(actualCall, expectedOptions.url)).toBe(true);
  }

  if (expectedOptions.baseURL) {
    expect(actualCall.baseURL).toBe(expectedOptions.baseURL);
  }

  if (expectedOptions.body) {
    expect(actualCall.body).toEqual(expectedOptions.body);
  }

  if (expectedOptions.qs) {
    expect(actualCall.qs).toEqual(expectedOptions.qs);
  }

  if (expectedOptions.headers) {
    expect(actualCall.headers).toMatchObject(expectedOptions.headers);
  }

  return actualCall;
}

/**
 * Verifies that required fields are present in the request body
 */
export function assertRequiredFields(
  requestBody: IDataObject,
  requiredFields: string[],
) {
  for (const field of requiredFields) {
    expect(requestBody).toHaveProperty(field);
    expect(requestBody[field]).toBeDefined();
  }
}

/**
 * Verifies that optional fields are included/excluded correctly
 */
export function assertOptionalField(
  requestBody: IDataObject,
  fieldName: string,
  shouldExist: boolean,
) {
  if (shouldExist) {
    expect(requestBody).toHaveProperty(fieldName);
  } else {
    expect(requestBody).not.toHaveProperty(fieldName);
  }
}

/**
 * Creates a mock response for API requests
 */
export function createMockApiResponse(data: IDataObject = {}): IDataObject {
  return {
    id: "test-id-123",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    ...data,
  };
}

/**
 * Verifies Authorization header is set correctly
 */
export function assertAuthorizationHeader(
  headers: IDataObject,
  accessToken: string,
) {
  expect(headers).toHaveProperty("Authorization");
  expect(headers.Authorization).toBe(`Bearer ${accessToken}`);
}

/**
 * Verifies common headers are set
 */
export function assertCommonHeaders(headers: IDataObject) {
  expect(headers).toHaveProperty("Accept", "application/json");
  expect(headers).toHaveProperty("Content-Type", "application/json");
}

/**
 * Safely casts request body to IDataObject for property access
 */
export function getRequestBody(request: IHttpRequestOptions): IDataObject {
  return request.body as IDataObject;
}
