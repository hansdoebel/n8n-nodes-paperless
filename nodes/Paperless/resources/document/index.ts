import type { INodeProperties } from "n8n-workflow";
import { documentGetCreationParametersDescription } from "./getCreationParameters";
import { documentGetManyDescription } from "./getAll";
import { documentGetDescription } from "./get";
import { documentCreateFromTemplateDescription } from "./createFromTemplate";
import { documentDuplicateDescription } from "./duplicateDocument";
import { documentCreateFromPdfDescription } from "./createFromPdf";
import { documentCreateFromScratchDescription } from "./createFromScratch";
import { documentUpdateDescription } from "./update";
import { documentDeleteDescription } from "./delete";

const showOnlyForDocument = {
  resource: ["document"],
};

export const documentDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: showOnlyForDocument,
    },
    options: [
      {
        name: 'Create From PDF',
        value: "createFromPdf",
        action: "Create a document from PDF",
        description: "Create a new document from a PDF file",
      },
      {
        name: 'Create From Scratch',
        value: "createFromScratch",
        action: "Create a document from scratch",
        description: "Create a new document from scratch",
      },
      {
        name: 'Create From Template',
        value: "createFromTemplate",
        action: "Create a document from template",
        description: "Create a new document from a template",
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete a document",
        description: "Delete an existing document",
      },
      {
        name: "Duplicate",
        value: "duplicateDocument",
        action: "Duplicate a document",
        description: "Duplicate an existing document",
      },
      {
        name: "Get",
        value: "get",
        action: "Get a document",
        description: "Get the data of a single document",
      },
      {
        name: "Get Creation Parameters",
        value: "getCreationParameters",
        action: "Get creation parameters",
        description: "Fetch possible parameters for document creation",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get documents",
        description: "Get many documents the user has access to",
      },
      {
        name: "Update",
        value: "update",
        action: "Update a document",
        description: "Update an existing document",
      },
    ],
    default: "getAll",
  },
  ...documentGetCreationParametersDescription,
  ...documentGetManyDescription,
  ...documentGetDescription,
  ...documentCreateFromTemplateDescription,
  ...documentDuplicateDescription,
  ...documentCreateFromPdfDescription,
  ...documentCreateFromScratchDescription,
  ...documentUpdateDescription,
  ...documentDeleteDescription,
];
