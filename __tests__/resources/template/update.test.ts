import type { IDataObject, IHttpRequestOptions } from "n8n-workflow";
import { templateUpdate } from "../../../nodes/Paperless/resources/template/update";
import { API_ENDPOINTS } from "../../../nodes/Paperless/utils/constants";
import {
  assertAuthorizationHeader,
  assertCommonHeaders,
  assertHttpRequest,
  assertOptionalField,
  createMockCredentials,
  createMockExecuteFunctions,
} from "../../utils/testHelpers";
import { mockTemplateResponse } from "../../fixtures/apiResponses";

describe("Template Resource - Update Operation", () => {
  let mockExecuteFunctions: ReturnType<typeof createMockExecuteFunctions>;
  let mockHttpRequest: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Required Parameters", () => {
    it("should make PATCH request with template ID in URL", async () => {
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

      await templateUpdate.call(mockExecuteFunctions);

      assertHttpRequest(mockHttpRequest, {
        method: "PATCH",
        baseURL: API_ENDPOINTS.BASE_URL,
        url: "/templates/311",
      });
    });

    it("should handle different template IDs", async () => {
      const testIds = ["311", "999", "tmpl_abc123"];

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

        await templateUpdate.call(mockExecuteFunctions);

        const actualRequest = mockHttpRequest.mock
          .calls[0][0] as IHttpRequestOptions;
        expect(actualRequest.url).toBe(`/templates/${templateId}`);

        jest.clearAllMocks();
      }
    });
  });

  describe("Optional Fields - Simple Fields", () => {
    it("should include name when provided", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {
          name: "Updated Template Name",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.name).toBe("Updated Template Name");
    });

    it("should include description when provided", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {
          description: "Updated description",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.description).toBe("Updated description");
    });

    it("should include original_content_locale when provided", async () => {
      const parameters = {
        templateId: "311",
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

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.original_content_locale).toBe("de-DE");
    });

    it("should include rendering_locale when provided", async () => {
      const parameters = {
        templateId: "311",
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

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.rendering_locale).toBe("fr-FR");
    });

    it("should include participant_completed_redirect_url when provided", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {
          participant_completed_redirect_url: "https://example.com/updated",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.participant_completed_redirect_url).toBe(
        "https://example.com/updated",
      );
    });

    it("should not include fields when empty strings", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {
          name: "",
          description: "",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      assertOptionalField(actualRequest.body as any, "name", false);
      assertOptionalField(actualRequest.body as any, "description", false);
    });
  });

  describe("Optional Fields - Boolean Fields", () => {
    it("should include forwarding_allowed as true", async () => {
      const parameters = {
        templateId: "311",
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

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.forwarding_allowed).toBe(true);
      expect(typeof (actualRequest.body as IDataObject)?.forwarding_allowed).toBe("boolean");
    });

    it("should include forwarding_allowed as false", async () => {
      const parameters = {
        templateId: "311",
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

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.forwarding_allowed).toBe(false);
    });

    it("should include delegation_allowed as true", async () => {
      const parameters = {
        templateId: "311",
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

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.delegation_allowed).toBe(true);
      expect(typeof (actualRequest.body as IDataObject)?.delegation_allowed).toBe("boolean");
    });

    it("should include delegation_allowed as false", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {
          delegation_allowed: false,
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.delegation_allowed).toBe(false);
    });
  });

  describe("Optional Fields - JSON Fields", () => {
    it("should parse and include settings JSON", async () => {
      const settings = { feature_enabled: true, max_participants: 10 };
      const parameters = {
        templateId: "311",
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

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.settings).toEqual(settings);
    });

    it("should parse and include reminder_settings JSON", async () => {
      const reminderSettings = { enabled: true, days_before: 3 };
      const parameters = {
        templateId: "311",
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

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.reminder_settings).toEqual(reminderSettings);
    });

    it("should parse and include content_locale_settings JSON", async () => {
      const contentLocaleSettings = [{ locale: "en-US", enabled: true }];
      const parameters = {
        templateId: "311",
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

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.content_locale_settings).toEqual(
        contentLocaleSettings,
      );
    });

    it("should parse and include localized_attributes JSON", async () => {
      const localizedAttributes = {
        "en-US": { title: "English" },
        "de-DE": { title: "Deutsch" },
      };
      const parameters = {
        templateId: "311",
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

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.localized_attributes).toEqual(
        localizedAttributes,
      );
    });

    it("should parse and include styles JSON", async () => {
      const styles = { background_color: "#FFFFFF", font_size: "14px" };
      const parameters = {
        templateId: "311",
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

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect((actualRequest.body as IDataObject)?.styles).toEqual(styles);
    });

    it("should not include JSON fields when empty string", async () => {
      const parameters = {
        templateId: "311",
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

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      assertOptionalField(actualRequest.body as any, "settings", false);
      assertOptionalField(actualRequest.body as any, "styles", false);
    });
  });

  describe("Query String Parameters", () => {
    it("should include expand parameter in query string", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {
          expand: ["creator", "blocks"],
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs).toHaveProperty("expand", "creator,blocks");
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

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.qs?.expand).toBeUndefined();
    });
  });

  describe("Request Headers", () => {
    it("should include Authorization header with Bearer token", async () => {
      const accessToken = "update-token-xyz";
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

      await templateUpdate.call(mockExecuteFunctions);

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

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      assertCommonHeaders(actualRequest.headers as any);
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

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.headers).toHaveProperty(
        "Paperless-Version",
        "2023-06-23",
      );
    });
  });

  describe("Response Processing", () => {
    it("should return response wrapped in INodeExecutionData", async () => {
      const parameters = {
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

      const result = await templateUpdate.call(mockExecuteFunctions);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("json");
      expect(result[0].json).toEqual(mockTemplateResponse);
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle multiple fields being updated together", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {
          name: "Comprehensive Update",
          description: "Updated description",
          original_content_locale: "en-US",
          rendering_locale: "de-DE",
          forwarding_allowed: true,
          delegation_allowed: false,
          participant_completed_redirect_url: "https://example.com/complete",
          settings: JSON.stringify({ auto_save: true }),
          styles: JSON.stringify({ color: "red" }),
          expand: ["creator", "participants"],
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockResolvedValue(mockTemplateResponse);

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.body).toMatchObject({
        name: "Comprehensive Update",
        description: "Updated description",
        original_content_locale: "en-US",
        rendering_locale: "de-DE",
        forwarding_allowed: true,
        delegation_allowed: false,
        participant_completed_redirect_url: "https://example.com/complete",
        settings: { auto_save: true },
        styles: { color: "red" },
      });
      expect(actualRequest.qs?.expand).toBe("creator,participants");
    });

    it("should send empty body when no fields are updated", async () => {
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

      await templateUpdate.call(mockExecuteFunctions);

      const actualRequest = mockHttpRequest.mock
        .calls[0][0] as IHttpRequestOptions;
      expect(actualRequest.body).toEqual({});
    });
  });

  describe("Error Handling", () => {
    it("should propagate API errors", async () => {
      const parameters = {
        templateId: "311",
        additionalFields: {
          name: "Test",
        },
      };

      mockExecuteFunctions = createMockExecuteFunctions(
        parameters,
        createMockCredentials(),
      );
      mockHttpRequest = mockExecuteFunctions.helpers.httpRequest as jest.Mock;
      mockHttpRequest.mockRejectedValue(new Error("Update failed"));

      await expect(templateUpdate.call(mockExecuteFunctions)).rejects.toThrow(
        "Update failed",
      );
    });
  });
});
