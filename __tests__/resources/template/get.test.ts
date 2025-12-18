import { API_ENDPOINTS } from "../../../nodes/Paperless/utils/constants";
import {
  assertHttpRequest,
  createMockCredentials,
  createMockExecuteFunctions,
} from "../../utils/testHelpers";
import { mockTemplateResponse } from "../../fixtures/apiResponses";
import { Paperless } from "../../../nodes/Paperless/Paperless.node";
import { NodeOperationError } from "n8n-workflow";

describe("Template Resource - Get Operation", () => {
  let paperlessNode: Paperless;
  let mockExecuteFunctions: ReturnType<typeof createMockExecuteFunctions>;
  let mockHttpRequest: jest.Mock;

  beforeEach(() => {
    paperlessNode = new Paperless();
    jest.clearAllMocks();
  });

  describe("Required Parameters", () => {
    it("should make GET request with template ID in URL", async () => {
      const parameters = {
        resource: "template",
        operation: "get",
        templateId: "311",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      assertHttpRequest(mockHttpRequest, {
        method: "GET",
        url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.TEMPLATES_GET("311")}`,
      });
    });

    it("should throw error when templateId is missing", async () => {
      const parameters = {
        resource: "template",
        operation: "get",
        templateId: "",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );

      await expect(paperlessNode.execute.call(mockExecuteFunctions)).rejects
        .toThrow(
          NodeOperationError,
        );
    });

    it("should include Authorization header", async () => {
      const accessToken = "secure-token-abc";
      const parameters = {
        resource: "template",
        operation: "get",
        templateId: "311",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(accessToken),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock.calls[0][0] as any;
      expect(actualRequest.headers?.Authorization).toBe(
        `Bearer ${accessToken}`,
      );
    });
  });

  describe("Optional Parameters", () => {
    it("should include expand parameter as comma-separated string", async () => {
      const parameters = {
        resource: "template",
        operation: "get",
        templateId: "311",
        additionalFields: {
          expand: ["creator", "participants", "blocks"],
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock.calls[0][0] as any;
      expect(actualRequest.qs).toHaveProperty(
        "expand",
        "creator,participants,blocks",
      );
    });

    it("should handle expand as string", async () => {
      const parameters = {
        resource: "template",
        operation: "get",
        templateId: "311",
        additionalFields: {
          expand: "creator,designs",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock.calls[0][0] as any;
      expect(actualRequest.qs).toHaveProperty("expand", "creator,designs");
    });

    it("should include workspace_id when provided", async () => {
      const parameters = {
        resource: "template",
        operation: "get",
        templateId: "311",
        additionalFields: {
          workspace_id: 1206,
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock.calls[0][0] as any;
      expect(actualRequest.qs).toHaveProperty("workspace_id", 1206);
    });

    it("should not include expand when empty", async () => {
      const parameters = {
        resource: "template",
        operation: "get",
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

      await paperlessNode.execute.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock.calls[0][0] as any;
      expect(actualRequest.qs?.expand).toBeUndefined();
    });
  });

  describe("Response Processing", () => {
    it("should return single item wrapped as array in INodeExecutionData", async () => {
      const parameters = {
        resource: "template",
        operation: "get",
        templateId: "311",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      const mockReturnJsonArray = mockExecuteFunctions.helpers
        .returnJsonArray as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);
      mockReturnJsonArray.mockReturnValue([{ json: mockTemplateResponse }]);

      const result = await paperlessNode.execute.call(mockExecuteFunctions);

      expect(mockReturnJsonArray).toHaveBeenCalledWith([mockTemplateResponse]);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(1);
    });
  });

  describe("URL Construction", () => {
    it("should construct correct URL with template ID", async () => {
      const testCases = ["311", "999", "template_xyz"];

      for (const templateId of testCases) {
        const parameters = {
          resource: "template",
          operation: "get",
          templateId,
          additionalFields: {},
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue(mockTemplateResponse);

        await paperlessNode.execute.call(mockExecuteFunctions);

        assertHttpRequest(mockHttpRequest, {
          url: `${API_ENDPOINTS.BASE_URL}/templates/${templateId}`,
        });

        jest.clearAllMocks();
      }
    });
  });

  describe("Error Handling", () => {
    it("should handle 404 errors for non-existent templates", async () => {
      const parameters = {
        resource: "template",
        operation: "get",
        templateId: "999999",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockRejectedValue(new Error("Not found"));

      await expect(paperlessNode.execute.call(mockExecuteFunctions)).rejects
        .toThrow();
    });
  });
});
