import type { IHttpRequestOptions } from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";
import { Paperless } from "../../nodes/Paperless/Paperless.node";
import { API_ENDPOINTS } from "../../nodes/Paperless/utils/constants";
import {
  assertAuthorizationHeader,
  createMockCredentials,
  createMockExecuteFunctions,
} from "../utils/testHelpers";
import {
  mockDocumentResponse,
  mockTemplateListResponse,
  mockTemplateResponse,
} from "../fixtures/apiResponses";

describe("Paperless Node", () => {
  let paperlessNode: Paperless;
  let mockExecuteFunctions: ReturnType<typeof createMockExecuteFunctions>;
  let mockHttpRequest: jest.Mock;

  beforeEach(() => {
    paperlessNode = new Paperless();
    jest.clearAllMocks();
  });

  describe("Node Metadata", () => {
    it("should have correct display name", () => {
      expect(paperlessNode.description.displayName).toBe("Paperless");
    });

    it("should have correct node name", () => {
      expect(paperlessNode.description.name).toBe("paperless");
    });

    it("should require paperlessApi credentials", () => {
      expect(paperlessNode.description.credentials).toEqual([
        { name: "paperlessApi", required: true },
      ]);
    });

    it("should have correct base URL in request defaults", () => {
      expect(paperlessNode.description.requestDefaults?.baseURL).toBe(
        API_ENDPOINTS.BASE_URL,
      );
    });

    it("should have correct default headers", () => {
      expect(paperlessNode.description.requestDefaults?.headers).toEqual({
        Accept: "application/json",
        "Content-Type": "application/json",
      });
    });

    it("should support being used as a tool", () => {
      expect(paperlessNode.description.usableAsTool).toBe(true);
    });
  });

  describe("Resource Selection", () => {
    it("should support blob resource", () => {
      const resourceProperty = paperlessNode.description.properties.find(
        (p) => p.name === "resource",
      );
      const blobOption = resourceProperty?.options?.find(
        (o: any) => o.value === "blob",
      );
      expect(blobOption).toBeDefined();
      expect(blobOption?.name).toBe("Blob");
    });

    it("should support document resource", () => {
      const resourceProperty = paperlessNode.description.properties.find(
        (p) => p.name === "resource",
      );
      const documentOption = resourceProperty?.options?.find(
        (o: any) => o.value === "document",
      );
      expect(documentOption).toBeDefined();
      expect(documentOption?.name).toBe("Document");
    });

    it("should support template resource", () => {
      const resourceProperty = paperlessNode.description.properties.find(
        (p) => p.name === "resource",
      );
      const templateOption = resourceProperty?.options?.find(
        (o: any) => o.value === "template",
      );
      expect(templateOption).toBeDefined();
      expect(templateOption?.name).toBe("Template");
    });

    it("should support process_run resource", () => {
      const resourceProperty = paperlessNode.description.properties.find(
        (p) => p.name === "resource",
      );
      const processRunOption = resourceProperty?.options?.find(
        (o: any) => o.value === "process_run",
      );
      expect(processRunOption).toBeDefined();
      expect(processRunOption?.name).toBe("Process Run");
    });

    it("should support submission resource", () => {
      const resourceProperty = paperlessNode.description.properties.find(
        (p) => p.name === "resource",
      );
      const submissionOption = resourceProperty?.options?.find(
        (o: any) => o.value === "submission",
      );
      expect(submissionOption).toBeDefined();
      expect(submissionOption?.name).toBe("Submission");
    });
  });

  describe("Template Operations", () => {
    describe("getAll", () => {
      it("should retrieve all templates", async () => {
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
        expect(actualRequest.method).toBe("GET");
        expect(actualRequest.url).toBe(
          `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.TEMPLATES_GET_ALL}`,
        );
      });

      it("should pass credentials to API request", async () => {
        const accessToken = "test-token-123";
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

    describe("get", () => {
      it("should retrieve single template by ID", async () => {
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

        const actualRequest = mockHttpRequest.mock
          .calls[0][0] as IHttpRequestOptions;
        expect(actualRequest.method).toBe("GET");
        expect(actualRequest.url).toBe(
          `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.TEMPLATES_GET("311")}`,
        );
      });

      it("should throw error when templateId is empty", async () => {
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

        await expect(
          paperlessNode.execute.call(mockExecuteFunctions),
        ).rejects.toThrow(NodeOperationError);
      });
    });

    describe("create", () => {
      it("should delegate to templateCreate function", async () => {
        const parameters = {
          resource: "template",
          operation: "create",
          workspace_id: 1206,
          name: "Test Template",
          additionalFields: {},
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue(mockTemplateResponse);

        const result = await paperlessNode.execute.call(mockExecuteFunctions);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveLength(1);
      });
    });

    describe("update", () => {
      it("should delegate to templateUpdate function", async () => {
        const parameters = {
          resource: "template",
          operation: "update",
          templateId: "311",
          additionalFields: {
            name: "Updated Name",
          },
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue(mockTemplateResponse);

        const result = await paperlessNode.execute.call(mockExecuteFunctions);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveLength(1);
      });
    });

    describe("delete", () => {
      it("should delegate to templateDelete function", async () => {
        const parameters = {
          resource: "template",
          operation: "delete",
          templateId: "311",
          additionalFields: {},
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue({ success: true });

        const result = await paperlessNode.execute.call(mockExecuteFunctions);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveLength(1);
      });
    });
  });

  describe("Document Operations", () => {
    describe("getAll", () => {
      it("should retrieve all documents", async () => {
        const parameters = {
          resource: "document",
          operation: "getAll",
          additionalFields: {},
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue([mockDocumentResponse]);

        await paperlessNode.execute.call(mockExecuteFunctions);

        const actualRequest = mockHttpRequest.mock
          .calls[0][0] as IHttpRequestOptions;
        expect(actualRequest.method).toBe("GET");
        expect(actualRequest.url).toBe(
          `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DOCUMENTS_GET_ALL}`,
        );
      });

      it("should support pagination parameters", async () => {
        const parameters = {
          resource: "document",
          operation: "getAll",
          additionalFields: {
            page: 2,
            per: 50,
          },
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue([mockDocumentResponse]);

        await paperlessNode.execute.call(mockExecuteFunctions);

        const actualRequest = mockHttpRequest.mock
          .calls[0][0] as IHttpRequestOptions;
        expect(actualRequest.qs).toMatchObject({
          page: 2,
          per_page: 50,
        });
      });

      it("should support search query parameter", async () => {
        const parameters = {
          resource: "document",
          operation: "getAll",
          additionalFields: {
            q: "invoice",
          },
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue([mockDocumentResponse]);

        await paperlessNode.execute.call(mockExecuteFunctions);

        const actualRequest = mockHttpRequest.mock
          .calls[0][0] as IHttpRequestOptions;
        expect(actualRequest.qs).toHaveProperty("q", "invoice");
      });

      it("should support sort parameter", async () => {
        const parameters = {
          resource: "document",
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
        mockHttpRequest.mockResolvedValue([mockDocumentResponse]);

        await paperlessNode.execute.call(mockExecuteFunctions);

        const actualRequest = mockHttpRequest.mock
          .calls[0][0] as IHttpRequestOptions;
        expect(actualRequest.qs).toHaveProperty("sort", "created_at");
      });
    });

    describe("get", () => {
      it("should retrieve single document by ID", async () => {
        const parameters = {
          resource: "document",
          operation: "get",
          documentId: "123",
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue(mockDocumentResponse);

        await paperlessNode.execute.call(mockExecuteFunctions);

        const actualRequest = mockHttpRequest.mock
          .calls[0][0] as IHttpRequestOptions;
        expect(actualRequest.method).toBe("GET");
        expect(actualRequest.url).toBe(
          `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DOCUMENTS_GET("123")}`,
        );
      });

      it("should throw error when documentId is empty", async () => {
        const parameters = {
          resource: "document",
          operation: "get",
          documentId: "",
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );

        await expect(
          paperlessNode.execute.call(mockExecuteFunctions),
        ).rejects.toThrow(NodeOperationError);
      });
    });

    describe("getCreationParameters", () => {
      it("should make OPTIONS request to get creation parameters", async () => {
        const parameters = {
          resource: "document",
          operation: "getCreationParameters",
          additionalFields: {},
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue({ fields: [] });

        await paperlessNode.execute.call(mockExecuteFunctions);

        const actualRequest = mockHttpRequest.mock
          .calls[0][0] as IHttpRequestOptions;
        expect(actualRequest.method).toBe("OPTIONS");
        expect(actualRequest.url).toBe(
          `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DOCUMENTS_CREATION_PARAMETERS}`,
        );
      });

      it("should include document_id in body when provided", async () => {
        const parameters = {
          resource: "document",
          operation: "getCreationParameters",
          additionalFields: {
            document_id: "doc_123",
          },
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue({ fields: [] });

        await paperlessNode.execute.call(mockExecuteFunctions);

        const actualRequest = mockHttpRequest.mock
          .calls[0][0] as IHttpRequestOptions;
        expect(actualRequest.body).toHaveProperty("document_id", "doc_123");
      });

      it("should include template_id in body when provided", async () => {
        const parameters = {
          resource: "document",
          operation: "getCreationParameters",
          additionalFields: {
            template_id: "tmpl_456",
          },
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue({ fields: [] });

        await paperlessNode.execute.call(mockExecuteFunctions);

        const actualRequest = mockHttpRequest.mock
          .calls[0][0] as IHttpRequestOptions;
        expect(actualRequest.body).toHaveProperty("template_id", "tmpl_456");
      });

      it("should throw error when both document_id and template_id are provided", async () => {
        const parameters = {
          resource: "document",
          operation: "getCreationParameters",
          additionalFields: {
            document_id: "doc_123",
            template_id: "tmpl_456",
          },
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );

        await expect(
          paperlessNode.execute.call(mockExecuteFunctions),
        ).rejects.toThrow(NodeOperationError);
      });
    });

    describe("createFromTemplate", () => {
      it("should delegate to documentCreateFromTemplate function", async () => {
        const parameters = {
          resource: "document",
          operation: "createFromTemplate",
          template_id: "311",
          additionalFields: {},
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue(mockDocumentResponse);

        const result = await paperlessNode.execute.call(mockExecuteFunctions);

        expect(result).toHaveLength(1);
      });
    });

    describe("duplicateDocument", () => {
      it("should delegate to documentDuplicate function", async () => {
        const parameters = {
          resource: "document",
          operation: "duplicateDocument",
          document_id: "123",
          additionalFields: {},
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue(mockDocumentResponse);

        const result = await paperlessNode.execute.call(mockExecuteFunctions);

        expect(result).toHaveLength(1);
      });
    });

    describe("createFromPdf", () => {
      it("should delegate to documentCreateFromPdf function", async () => {
        const parameters = {
          resource: "document",
          operation: "createFromPdf",
          pdf_blob_signed_id: "blob_123",
          additionalFields: {},
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue(mockDocumentResponse);

        const result = await paperlessNode.execute.call(mockExecuteFunctions);

        expect(result).toHaveLength(1);
      });
    });

    describe("createFromScratch", () => {
      it("should delegate to documentCreateFromScratch function", async () => {
        const parameters = {
          resource: "document",
          operation: "createFromScratch",
          workspace_id: 1206,
          additionalFields: {},
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue(mockDocumentResponse);

        const result = await paperlessNode.execute.call(mockExecuteFunctions);

        expect(result).toHaveLength(1);
      });
    });

    describe("update", () => {
      it("should delegate to documentUpdate function", async () => {
        const parameters = {
          resource: "document",
          operation: "update",
          documentId: "123",
          additionalFields: {},
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue(mockDocumentResponse);

        const result = await paperlessNode.execute.call(mockExecuteFunctions);

        expect(result).toHaveLength(1);
      });
    });

    describe("delete", () => {
      it("should delegate to documentDelete function", async () => {
        const parameters = {
          resource: "document",
          operation: "delete",
          documentId: "123",
          additionalFields: {},
        };

        mockExecuteFunctions = createMockExecuteFunctions(
          parameters,
          createMockCredentials(),
        );
        mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
        mockHttpRequest.mockResolvedValue({ success: true });

        const result = await paperlessNode.execute.call(mockExecuteFunctions);

        expect(result).toHaveLength(1);
      });
    });
  });

  describe("Error Handling", () => {
    it("should wrap errors in NodeOperationError", async () => {
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
      mockHttpRequest.mockRejectedValue(new Error("Network error"));

      await expect(
        paperlessNode.execute.call(mockExecuteFunctions),
      ).rejects.toThrow(NodeOperationError);
    });

    it("should handle string errors", async () => {
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
      mockHttpRequest.mockRejectedValue("String error");

      await expect(
        paperlessNode.execute.call(mockExecuteFunctions),
      ).rejects.toThrow(NodeOperationError);
    });

    it("should propagate error message in NodeOperationError", async () => {
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
      const customError = new Error("Custom API error");
      mockHttpRequest.mockRejectedValue(customError);

      try {
        await paperlessNode.execute.call(mockExecuteFunctions);
        fail("Should have thrown error");
      } catch (error) {
        expect(error).toBeInstanceOf(NodeOperationError);
        expect((error as NodeOperationError).message).toBe("Custom API error");
      }
    });
  });

  describe("Credentials Handling", () => {
    it("should retrieve credentials for all operations", async () => {
      const parameters = {
        resource: "template",
        operation: "getAll",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials("my-access-token"),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateListResponse);

      await paperlessNode.execute.call(mockExecuteFunctions);

      expect(mockExecuteFunctions.getCredentials).toHaveBeenCalledWith(
        "paperlessApi",
      );
    });

    it("should use access token from credentials in Authorization header", async () => {
      const accessToken = "secure-token-xyz-789";
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
      expect(actualRequest.headers?.Authorization).toBe(
        `Bearer ${accessToken}`,
      );
    });
  });
});
