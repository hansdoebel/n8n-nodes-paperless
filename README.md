# n8n-nodes-paperless

## ⚠️ Caution: Early / Experimental Version

> **This project is in a very early stage. Not everything has been tested yet.**
>
> Expect bugs, missing features, and breaking changes.
> **Do not use in production** unless you know what you’re doing.
This is an n8n community node. It lets you use Paperless in your n8n workflows.
----

Paperless is a document management system that transforms your physical documents into a searchable online archive so you can keep, well, nothing on paper.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)   
[Operations](#operations)   
[Credentials](#credentials)   
[Resources](#resources)   
[Version history](#version-history)   

----

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to **Settings** > **Community Nodes.**
2. Select **Install.**
3. Type `n8n-nodes-paperless` (and version number if required) into **npm Package Name** field
5. Agree to the risks of using community nodes: select I understand the risks of installing unverified code from a public source.
6. Select Install. n8n installs the node, and returns to the Community Nodes list in Settings.

----

## Operations

### Blob
- **Create** – Create a new blob for file uploads

### Document
- **Get Creation Parameters** – Get parameters for creating documents
- **Get All** – List all documents with pagination and filtering
- **Get** – Retrieve a single document by ID
- **Create from Template** – Create a document from a template
- **Create from PDF** – Create a document from a PDF file
- **Create from Scratch** – Create a new blank document
- **Duplicate** – Duplicate an existing document
- **Update** – Update document properties
- **Delete** – Delete a document

### Process Run
- **Create from Scratch** – Create a process run from scratch
- **Create from Submission** – Create a process run from a submission
- **Create from Payload** – Create a process run from custom input payload

### Submission
- **Get** – Retrieve a submission by ID

### Template
- **Get All** – List all templates with pagination and filtering
- **Get** – Retrieve a single template by ID
- **Create** – Create a new template
- **Update** – Update template properties
- **Delete** – Delete a template

----

## Credentials

To use this node, you need a Paperless API token.

### Authentication

This node uses Bearer token authentication. You will need:

- **API Token** – Your Paperless API access token

Generate this token in your Paperless instance admin panel and provide it when setting up the credentials.

----

## Roadmap

- [ ] Webhooks


----

## Resources

- [Paperless API docs](https://developers.paperless.io/docs/api)
- [Paperless Documentation](https://docs.paperless-ngx.com/)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

----

## Version history

- 0.1.2 – added tests, refactor.
- 0.1.1 – Initial release with Blob, Document, Process Run, Submission, and Template resources.
