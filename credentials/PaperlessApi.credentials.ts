import type {
  IAuthenticateGeneric,
  Icon,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../nodes/Paperless/utils/constants";

export class PaperlessApi implements ICredentialType {
  name = "paperlessApi";

  displayName = "Paperless API";

  documentationUrl =
    "https://developers.paperless.io/docs/api/f935d3abd73dd-getting-started-with-the-paperless-api";

  icon: Icon = "file:../nodes/Paperless/paperless.svg";

  properties: INodeProperties[] = [
    {
      displayName: "Access Token",
      name: "accessToken",
      type: "string",
      typeOptions: { password: true },
      required: true,
      default: "",
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
      headers: {
        Authorization: "=Bearer {{$credentials.accessToken}}",
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: API_ENDPOINTS.BASE_URL,
      url: API_ENDPOINTS.TEMPLATES_GET_ALL,
    },
  };
}
