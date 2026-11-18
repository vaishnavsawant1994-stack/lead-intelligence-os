import UnavailableFeature from "@/components/UnavailableFeature";

export default function Page() {
  return <UnavailableFeature title="AI lead scoring" description="The displayed lead scores were hardcoded and were not computed by a validated model." requires="Qualified scoring method, consent-safe data, evaluation, explainability and real inference" />;
}
