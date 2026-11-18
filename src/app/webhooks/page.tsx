import UnavailableFeature from "@/components/UnavailableFeature";

export default function Page() {
  return <UnavailableFeature title="Outbound webhooks" description="The previous Active webhook was an example URL. No signed durable webhook delivery was configured." requires="Signed deliveries, retry policies, idempotency, endpoint validation and delivery logs" />;
}
