import type { INodeProperties } from "n8n-workflow";

const showOnlyForTemplateGet = {
  operation: ["get"],
  resource: ["template"],
};

export const templateGetDescription: INodeProperties[] = [
  {
    displayName: "Template ID",
    name: "templateId",
    type: "string",
    required: true,
    default: "",
    placeholder: "e.g. 311",
    description: "ID of the template to retrieve",
    displayOptions: {
      show: showOnlyForTemplateGet,
    },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    displayOptions: {
      show: showOnlyForTemplateGet,
    },
    default: {},
    options: [
      {
        displayName: "Disposition",
        name: "disposition",
        type: "options",
        default: "inline",
        options: [
          {
            name: "Inline",
            value: "inline",
          },
          {
            name: "Attachment",
            value: "attachment",
          },
        ],
        description: "How to return the response",
      },
      // {
      //   displayName: "Expand",
      //   name: "expand",
      //   type: "multiOptions",
      //   default: [],
      //   options: [],
      //   description:
      //     "Related resources to expand in the response (depends on API support)",
      //   routing: {
      //     send: {
      //       type: "query",
      //       property: "expand",
      //     },
      //   },
      // },
      //
      //
      // Expandable properties
      // The type Template contains the following expandable properties:

      //     creator
      //     designs
      //     participants
      //     participation_flow
      //     tokens
      //     blocks
    ],
  },
];
