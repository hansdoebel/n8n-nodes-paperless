import type { INodeProperties } from "n8n-workflow";
import { templateGetAll, templateGetManyDescription } from "./getAll";
import { templateGet, templateGetDescription } from "./get";
import { templateCreate, templateCreateDescription } from "./create";
import { templateUpdate, templateUpdateDescription } from "./update";
import { templateDelete, templateDeleteDescription } from "./delete";

export {
  templateCreate,
  templateDelete,
  templateGet,
  templateGetAll,
  templateUpdate,
};

const showOnlyForTemplates = {
  resource: ["template"],
};

export const templateDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: showOnlyForTemplates,
    },
    options: [
      {
        name: "Create",
        value: "create",
        action: "Create a template",
        description: "Create a new template",
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete a template",
        description: "Delete an existing template",
      },
      {
        name: "Get",
        value: "get",
        action: "Get a template",
        description: "Get the data of a single template",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get templates",
        description: "Get many templates",
      },
      {
        name: "Update",
        value: "update",
        action: "Update a template",
        description: "Update an existing template",
      },
    ],
    default: "getAll",
  },
  ...templateGetManyDescription,
  ...templateGetDescription,
  ...templateCreateDescription,
  ...templateUpdateDescription,
  ...templateDeleteDescription,
];
