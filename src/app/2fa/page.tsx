import UnavailableFeature from "@/components/UnavailableFeature";

export default function Page() {
  return <UnavailableFeature title="Two-factor authentication" description="Two-factor enrollment is not implemented. A prior toggle changed only the screen and did not secure the account." requires="Production identity provider, secure enrollment, recovery and enforcement tests" />;
}
