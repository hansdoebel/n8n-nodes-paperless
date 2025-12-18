import {
  type IDataObject,
  type IExecuteFunctions,
  type IHttpRequestOptions,
} from "n8n-workflow";
import { API_ENDPOINTS } from "./constants";

export async function paperlessRequest(
  this: IExecuteFunctions,
  accessToken: string,
  options: Partial<IHttpRequestOptions> = {},
) {
  if (!accessToken) {
    throw new Error("accessToken is required");
  }

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
    Authorization: `Bearer ${accessToken}`,
  };

  const opts: IHttpRequestOptions = {
    baseURL: API_ENDPOINTS.BASE_URL,
    ...options,
    headers,
  } as IHttpRequestOptions;

  return this.helpers.httpRequest!(opts);
}

type MappingValue =
  | string
  | ((v: unknown) => [string, unknown] | undefined);

export function buildQs(
  additional: IDataObject,
  mapping: Record<string, MappingValue>,
): IDataObject {
  const qs: IDataObject = {};
  if (!additional) return qs;

  for (const [field, mapTo] of Object.entries(mapping)) {
    const val = additional[field as keyof IDataObject];
    if (val === undefined || val === "") continue;

    if (typeof mapTo === "function") {
      const pair = mapTo(val);
      if (!pair) continue;
      const [k, v] = pair;
      if (v !== undefined) qs[k] = v;
      continue;
    }

    const key = mapTo;
    if (Array.isArray(val)) {
      if (val.length) qs[key] = val.join(",");
      continue;
    }

    if (typeof val === "boolean") {
      qs[key] = val;
      continue;
    }

    qs[key] = val;
  }

  return qs;
}
