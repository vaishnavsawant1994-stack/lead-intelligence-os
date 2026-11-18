import UnavailableFeature from "@/components/UnavailableFeature";

export default function Page() {
  return <UnavailableFeature title="Automation rules" description="The old active automation was a static example; no durable trigger or execution engine was proven." requires="Queued execution, safety approval, retries, activity history and monitoring" />;
}
