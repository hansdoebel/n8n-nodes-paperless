import type { IHttpRequestOptions } from "n8n-workflow";
import { templateDelete } from "../../../nodes/Paperless/resources/template/delete";
import { API_ENDPOINTS } from "../../../nodes/Paperless/utils/constants";
import {
  assertAuthorizationHeader,
  assertCommonHeaders,
  assertHttpRequest,
  createMockCredentials,
  createMockExecuteFunctions,
} from "../../utils/testHelpers";
import { mockTemplateResponse } from "../../fixtures/apiResponses";

describe("Template Resource - Delete Operation", () => {
  let mockExecuteFunctions: ReturnType<typeof createMockExecuteFunctions>;
  let mockHttpRequest: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Required Parameters", () => {
    it("should make DELETE request with template ID in URL", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateDelete.call(mockExecuteFunctions);

      assertHttpRequest(mockHttpRequest, {
        method: "DELETE",
        baseURL: API_ENDPOINTS.BASE_URL,
        url: "/templates/311",
      });
    });

    it("should handle different template IDs in URL", async () => {
      const testIds = ["311", "999", "template_xyz"];

      for (const templateId of testIds) {
        const parameters = {
          templateId,
          additionalFields: {},
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue(mockTemplateResponse);

        await templateDelete.call(mockExecuteFunctions);

        const actualRequest = mockHttpRequest.mock
          .calls[0][0] as IHttpRequestOptions;
        expect(actualRequest.url).toBe(`/templates/${templateId}`);

        jest.clearAllMocks();
      }
    });
  });

  describe("Optional Parameters", () => {
    it("should include expand parameter in query string", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {
          expand: ["creator", "participants"],
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateDelete.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs).toHaveProperty("expand", "creator,participants");
    });

    it("should not include expand when empty", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {
          expand: [],
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateDelete.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs?.expand).toBeUndefined();
    });

    it("should include Paperless-Version header when provided", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {
          paperless_version: "2023-06-23",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateDelete.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.headers).toHaveProperty(
        "Paperless-Version",
        "2023-06-23",
      );
    });

    it("should not include Paperless-Version header when not provided", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateDelete.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.headers).not.toHaveProperty("Paperless-Version");
    });
  });

  describe("Request Headers", () => {
    it("should include Authorization header with Bearer token", async () => {
      const accessToken = "delete-token-abc";
      const parameters = {
        templateId: "311",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(accessToken),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateDelete.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      assertAuthorizationHeader(actualRequest.headers as any, accessToken);
    });

    it("should include common headers", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateDelete.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      assertCommonHeaders(actualRequest.headers as any);
    });
  });

  describe("Response Processing", () => {
    it("should return response wrapped in INodeExecutionData", async () => {
      const deleteResponse = { success: true, id: "311" };
      const parameters = {
        templateId: "311",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(deleteResponse);

      const result = await templateDelete.call(mockExecuteFunctions);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("json");
      expect(result[0].json).toEqual(deleteResponse);
    });

    it("should handle empty response from API", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue({});

      const result = await templateDelete.call(mockExecuteFunctions);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({});
    });
  });

  describe("Request Structure", () => {
    it("should not include request body in DELETE request", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateDelete.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.body).toBeUndefined();
    });

    it("should use correct base URL and endpoint", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateDelete.call(mockExecuteFunctions);

      assertHttpRequest(mockHttpRequest, {
        method: "DELETE",
        baseURL: "https://api.paperless.io/api/v1",
        url: "/templates/311",
      });
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle delete with expand and version header", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {
          expand: ["creator", "blocks", "participants"],
          paperless_version: "2023-06-23",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateDelete.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs?.expand).toBe("creator,blocks,participants");
      expect(actualRequest.headers).toHaveProperty(
        "Paperless-Version",
        "2023-06-23",
      );
    });
  });

  describe("Error Handling", () => {
    it("should propagate API errors", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockRejectedValue(new Error("Template not found"));

      await expect(templateDelete.call(mockExecuteFunctions)).rejects.toThrow(
        "Template not found",
      );
    });

    it("should handle permission errors", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockRejectedValue(new Error("Forbidden"));

      await expect(templateDelete.call(mockExecuteFunctions)).rejects.toThrow(
        "Forbidden",
      );
    });
  });
});
