import UnavailableFeature from "@/components/UnavailableFeature";

export default function Page() {
  return <UnavailableFeature title="Shared inbox" description="Messages shown in the old inbox were samples; there is no verified connected mailbox." requires="OAuth mailbox access, secure storage, sync, reply safety and consent" />;
}
