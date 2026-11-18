import UnavailableFeature from "@/components/UnavailableFeature";

export default function Page() {
  return <UnavailableFeature title="Email analytics" description="The app has no verified provider event stream or consent-aware email performance data. Do not interpret demo metrics as delivered email outcomes." requires="Verified delivery events, unsubscribe and suppression, durable metrics" />;
}
