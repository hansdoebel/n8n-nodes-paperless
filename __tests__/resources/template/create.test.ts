import type { IDataObject, IHttpRequestOptions } from "n8n-workflow";
import { templateCreate } from "../../../nodes/Paperless/resources/template/create";
import { API_ENDPOINTS } from "../../../nodes/Paperless/utils/constants";
import {
  assertAuthorizationHeader,
  assertCommonHeaders,
  assertHttpRequest,
  assertOptionalField,
  assertRequiredFields,
  createMockCredentials,
  createMockExecuteFunctions,
} from "../../utils/testHelpers";
import { mockTemplateResponse } from "../../fixtures/apiResponses";

describe("Template Resource - Create Operation", () => {
  let mockExecuteFunctions: ReturnType<typeof createMockExecuteFunctions>;
  let mockHttpRequest: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Required Parameters", () => {
    it("should send required fields: workspace_id and name", async () => {
      const parameters = {
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

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = assertHttpRequest(mockHttpRequest, {
        method: "POST",
        baseURL: API_ENDPOINTS.BASE_URL,
        url: "/templates",
      });

      assertRequiredFields(actualRequest.body as any, ["workspace_id", "name"]);
      expect(actualRequest.body).toMatchObject({
        workspace_id: 1206,
        name: "Test Template",
      });
    });

    it("should include workspace_id as number type", async () => {
      const parameters = {
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

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(typeof (actualRequest.body as IDataObject)?.workspace_id).toBe("number");
      expect((actualRequest.body as IDataObject)?.workspace_id).toBe(1206);
    });

    it("should include name as string type", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "My Custom Template",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(typeof (actualRequest.body as IDataObject)?.name).toBe("string");
      expect((actualRequest.body as IDataObject)?.name).toBe("My Custom Template");
    });
  });

  describe("Optional Top-Level Parameters", () => {
    it("should include template_id when provided", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Duplicated Template",
        template_id: "999",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      assertOptionalField(actualRequest.body as any, "template_id", true);
      expect((actualRequest.body as IDataObject)?.template_id).toBe("999");
    });

    it("should not include template_id when empty", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        template_id: "",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      assertOptionalField(actualRequest.body as any, "template_id", false);
    });

    it("should include document_id when provided", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Template from Document",
        document_id: "doc_123",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      assertOptionalField(actualRequest.body as any, "document_id", true);
      expect((actualRequest.body as IDataObject)?.document_id).toBe("doc_123");
    });

    it('should include pdf blob signed_id as "pdf" field when provided', async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Template from PDF",
        pdf_blob_signed_id: "blob_signed_abc123",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      assertOptionalField(actualRequest.body as any, "pdf", true);
      expect((actualRequest.body as IDataObject)?.pdf).toBe("blob_signed_abc123");
    });

    it("should not include pdf field when pdf_blob_signed_id is empty", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        pdf_blob_signed_id: "",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      assertOptionalField(actualRequest.body as any, "pdf", false);
    });
  });

  describe("Additional Fields - Simple Fields", () => {
    it("should include description when provided", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {
          description: "This is a test template description",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.description).toBe(
        "This is a test template description",
      );
    });

    it("should include original_content_locale when provided", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {
          original_content_locale: "de-DE",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.original_content_locale).toBe("de-DE");
    });

    it("should include rendering_locale when provided", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {
          rendering_locale: "fr-FR",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.rendering_locale).toBe("fr-FR");
    });

    it("should include participant_completed_redirect_url when provided", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {
          participant_completed_redirect_url: "https://example.com/thank-you",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.participant_completed_redirect_url).toBe(
        "https://example.com/thank-you",
      );
    });
  });

  describe("Additional Fields - Boolean Fields", () => {
    it("should include forwarding_allowed as boolean when true", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {
          forwarding_allowed: true,
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.forwarding_allowed).toBe(true);
      expect(typeof (actualRequest.body as IDataObject)?.forwarding_allowed).toBe("boolean");
    });

    it("should include forwarding_allowed as boolean when false", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {
          forwarding_allowed: false,
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.forwarding_allowed).toBe(false);
    });

    it("should include delegation_allowed as boolean when true", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {
          delegation_allowed: true,
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.delegation_allowed).toBe(true);
      expect(typeof (actualRequest.body as IDataObject)?.delegation_allowed).toBe("boolean");
    });
  });

  describe("Additional Fields - JSON Fields", () => {
    it("should parse and include settings JSON", async () => {
      const settings = { enable_notifications: true, auto_save: false };
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {
          settings: JSON.stringify(settings),
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.settings).toEqual(settings);
    });

    it("should parse and include reminder_settings JSON", async () => {
      const reminderSettings = {
        enabled: true,
        interval_days: 7,
      };
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {
          reminder_settings: JSON.stringify(reminderSettings),
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.reminder_settings).toEqual(reminderSettings);
    });

    it("should parse and include content_locale_settings JSON array", async () => {
      const contentLocaleSettings = [
        { locale: "en-US", enabled: true },
        { locale: "de-DE", enabled: false },
      ];
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {
          content_locale_settings: JSON.stringify(contentLocaleSettings),
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.content_locale_settings).toEqual(
        contentLocaleSettings,
      );
    });

    it("should parse and include localized_attributes JSON", async () => {
      const localizedAttributes = {
        "en-US": { title: "English Title" },
        "de-DE": { title: "Deutscher Titel" },
      };
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {
          localized_attributes: JSON.stringify(localizedAttributes),
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.localized_attributes).toEqual(
        localizedAttributes,
      );
    });

    it("should parse and include styles JSON", async () => {
      const styles = {
        primary_color: "#FF0000",
        font_family: "Arial",
      };
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {
          styles: JSON.stringify(styles),
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.styles).toEqual(styles);
    });

    it("should handle empty string for JSON fields by not including them", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {
          settings: "",
          styles: "",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      assertOptionalField(actualRequest.body as any, "settings", false);
      assertOptionalField(actualRequest.body as any, "styles", false);
    });
  });

  describe("Query String Parameters", () => {
    it("should include expand parameter in query string when provided", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
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

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs).toHaveProperty("expand");
      expect(actualRequest.qs?.expand).toBe("creator,participants,blocks");
    });

    it("should not include expand when array is empty", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
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

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs?.expand).toBeUndefined();
    });
  });

  describe("Request Headers", () => {
    it("should include Authorization header with Bearer token", async () => {
      const accessToken = "my-test-token-123";
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(accessToken),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      assertAuthorizationHeader(actualRequest.headers as any, accessToken);
    });

    it("should include standard content headers", async () => {
      const parameters = {
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

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      assertCommonHeaders(actualRequest.headers as any);
    });

    it("should include Paperless-Version header when provided", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
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

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.headers).toHaveProperty(
        "Paperless-Version",
        "2023-06-23",
      );
    });

    it("should not include Paperless-Version header when not provided", async () => {
      const parameters = {
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

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.headers).not.toHaveProperty("Paperless-Version");
    });
  });

  describe("Response Processing", () => {
    it("should return response wrapped in INodeExecutionData", async () => {
      const parameters = {
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

      const result = await templateCreate.call(mockExecuteFunctions);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("json");
      expect(result[0].json).toEqual(mockTemplateResponse);
    });

    it("should return actual API response data", async () => {
      const customResponse = {
        id: "999",
        workspace_id: 1206,
        name: "Custom Template Name",
      };
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(customResponse);

      const result = await templateCreate.call(mockExecuteFunctions);

      expect(result[0].json).toEqual(customResponse);
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle all optional fields together", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Complex Template",
        template_id: "base_template_123",
        additionalFields: {
          description: "A complex template with many fields",
          original_content_locale: "en-US",
          rendering_locale: "de-DE",
          forwarding_allowed: true,
          delegation_allowed: true,
          participant_completed_redirect_url: "https://example.com/done",
          settings: JSON.stringify({ feature_x: true }),
          styles: JSON.stringify({ color: "blue" }),
          expand: ["creator", "blocks"],
          paperless_version: "2023-06-23",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateCreate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;

      // Verify body
      expect(actualRequest.body).toMatchObject({
        workspace_id: 1206,
        name: "Complex Template",
        template_id: "base_template_123",
        description: "A complex template with many fields",
        original_content_locale: "en-US",
        rendering_locale: "de-DE",
        forwarding_allowed: true,
        delegation_allowed: true,
        participant_completed_redirect_url: "https://example.com/done",
        settings: { feature_x: true },
        styles: { color: "blue" },
      });

      // Verify query string
      expect(actualRequest.qs?.expand).toBe("creator,blocks");

      // Verify headers
      expect(actualRequest.headers).toHaveProperty(
        "Paperless-Version",
        "2023-06-23",
      );
    });

    it("should make POST request to correct endpoint", async () => {
      const parameters = {
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

      await templateCreate.call(mockExecuteFunctions);

      assertHttpRequest(mockHttpRequest, {
        method: "POST",
        baseURL: "https://api.paperless.io/api/v1",
        url: "/templates",
      });
    });
  });

  describe("Error Scenarios", () => {
    it("should propagate API errors", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockRejectedValue(
        new Error("API Error: Invalid workspace"),
      );

      await expect(templateCreate.call(mockExecuteFunctions)).rejects.toThrow(
        "API Error: Invalid workspace",
      );
    });

    it("should handle network errors", async () => {
      const parameters = {
        workspace_id: 1206,
        name: "Test Template",
        additionalFields: {},
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockRejectedValue(new Error("Network error"));

      await expect(templateCreate.call(mockExecuteFunctions)).rejects.toThrow(
        "Network error",
      );
    });
  });
});
