import UnavailableFeature from "@/components/UnavailableFeature";

export default function Page() {
  return <UnavailableFeature title="Meetings" description="The prior scheduled meetings were examples; calendar integration and meeting records are not qualified." requires="Persistent calendar events, timezone correctness, sync and permissions" />;
}
