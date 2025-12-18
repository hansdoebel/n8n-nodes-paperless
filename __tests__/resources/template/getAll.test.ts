import type { IHttpRequestOptions } from "n8n-workflow";
import { API_ENDPOINTS } from "../../../nodes/Paperless/utils/constants";
import {
  assertAuthorizationHeader,
  assertHttpRequest,
  createMockCredentials,
  createMockExecuteFunctions,
} from "../../utils/testHelpers";
import { mockTemplateListResponse } from "../../fixtures/apiResponses";
import { Paperless } from "../../../nodes/Paperless/Paperless.node";

describe("Template Resource - GetAll Operation", () => {
  let paperlessNode: Paperless;
  let mockExecuteFunctions: ReturnType<typeof createMockExecuteFunctions>;
  let mockHttpRequest: jest.Mock;

  beforeEach(() => {
    paperlessNode = new Paperless();
    jest.clearAllMocks();
  });

  describe("Basic Request", () => {
    it("should make GET request to templates endpoint with no parameters", async () => {
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateListResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      assertHttpRequest(mockHttpRequest, {
        method: "GET",
        
        url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.TEMPLATES_GET_ALL}`,
      });
    });

    it("should include Authorization header", async () => {
      const accessToken = "test-token-xyz";
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(accessToken),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateListResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      assertAuthorizationHeader(actualRequest.headers as any, accessToken);
    });
  });

  describe("Pagination Parameters", () => {
    it("should include page parameter when provided", async () => {
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {
          page: 2,
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateListResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs).toHaveProperty("page", 2);
    });

    it("should include per_page parameter when provided", async () => {
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {
          per: 50,
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateListResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs).toHaveProperty("per_page", 50);
    });

    it("should not include pagination params when not provided", async () => {
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateListResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs?.page).toBeUndefined();
      expect(actualRequest.qs?.per_page).toBeUndefined();
    });
  });

  describe("Filter Parameters", () => {
    it("should include creator_id filter when provided", async () => {
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {
          creator_id: 2508,
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateListResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs).toHaveProperty("creator_id", 2508);
    });

    it("should include workspace_id filter when provided", async () => {
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {
          workspace_id: 1206,
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateListResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs).toHaveProperty("workspace_id", 1206);
    });

    it("should include search query parameter when provided", async () => {
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {
          q: "contract",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateListResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs).toHaveProperty("q", "contract");
    });

    it("should include sort parameter when provided", async () => {
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {
          sort: "created_at",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateListResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs).toHaveProperty("sort", "created_at");
    });

    it("should include count parameter when true", async () => {
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {
          count: true,
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateListResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs).toHaveProperty("count", true);
    });
  });

  describe("Expand Parameter", () => {
    it("should include expand parameter as comma-separated string from array", async () => {
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {
          expand: ["creator", "participants", "blocks"],
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateListResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs).toHaveProperty(
        "expand",
        "creator,participants,blocks",
      );
    });

    it("should handle expand as string value", async () => {
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {
          expand: "creator,designs",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateListResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs).toHaveProperty("expand", "creator,designs");
    });

    it("should not include expand when array is empty", async () => {
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {
          expand: [],
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateListResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs?.expand).toBeUndefined();
    });
  });

  describe("Response Processing", () => {
    it("should return array response wrapped in INodeExecutionData", async () => {
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      const mockReturnJsonArray = mockExecuteFunctions.helpers
        .returnJsonArray as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateListResponse);
      mockReturnJsonArray.mockReturnValue(
        mockTemplateListResponse.map((item) => ({ json: item })),
      );

      const result = await paperlessNode.execute.call(mockExecuteFunctions);

      expect(mockReturnJsonArray).toHaveBeenCalledWith(
        mockTemplateListResponse,
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(2);
    });

    it("should handle single item response as array", async () => {
      const singleItemResponse = { id: "311", name: "Single Template" };
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      const mockReturnJsonArray = mockExecuteFunctions.helpers
        .returnJsonArray as jest.Mock;
      mockHttpRequest.mockResolvedValue(singleItemResponse);
      mockReturnJsonArray.mockReturnValue([{ json: singleItemResponse }]);

      await paperlessNode.execute.call(mockExecuteFunctions);

      expect(mockReturnJsonArray).toHaveBeenCalledWith([singleItemResponse]);
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle all query parameters together", async () => {
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {
          page: 3,
          per: 25,
          creator_id: 2508,
          workspace_id: 1206,
          q: "invoice",
          sort: "-created_at",
          count: true,
          expand: ["creator", "blocks"],
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateListResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs).toMatchObject({
        page: 3,
        per_page: 25,
        creator_id: 2508,
        workspace_id: 1206,
        q: "invoice",
        sort: "-created_at",
        count: true,
        expand: "creator,blocks",
      });
    });
  });

  describe("Error Handling", () => {
    it("should propagate API errors", async () => {
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockRejectedValue(new Error("Unauthorized"));

      await expect(paperlessNode.execute.call(mockExecuteFunctions)).rejects
        .toThrow();
    });
  });
});
