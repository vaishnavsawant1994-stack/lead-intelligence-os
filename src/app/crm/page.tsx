import UnavailableFeature from "@/components/UnavailableFeature";

export default function Page() {
  return <UnavailableFeature title="Third-party CRM integrations" description="HubSpot and Salesforce are not connected. The prior controls only updated local state; the built-in Leadveyra CRM has its own PostgreSQL workflows." requires="Supported OAuth, field mapping, sync queues, auditability and failure handling" />;
}
