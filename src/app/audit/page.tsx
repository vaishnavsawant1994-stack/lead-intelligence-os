import UnavailableFeature from "@/components/UnavailableFeature";

export default function Page() {
  return <UnavailableFeature title="Audit history" description="A durable audit trail for record and administrator activity has not been implemented. No activity is falsely presented as evidence." requires="Immutable or protected event storage, actor attribution, filtering and retention policy" />;
}
