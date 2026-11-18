import UnavailableFeature from "@/components/UnavailableFeature";

export default function Page() {
  return <UnavailableFeature title="Billing and subscriptions" description="The previous Starter and Pro prices were sample UI, not configured plans or verified payment subscriptions." requires="Approved pricing, payment provider, webhook verification, entitlement and billing reconciliation" />;
}
