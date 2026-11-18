import UnavailableFeature from "@/components/UnavailableFeature";

export default function Page() {
  return <UnavailableFeature title="Email provider integrations" description="Neither Gmail nor Outlook is connected. The prior buttons displayed a connected state without OAuth authorization." requires="OAuth provider registration, encrypted token storage, scopes, refresh/revocation and mail permission tests" />;
}
