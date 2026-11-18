import UnavailableFeature from "@/components/UnavailableFeature";

export default function Page() {
  return <UnavailableFeature title="API key management" description="Production API key issuance and revocation have not been security-qualified. Do not treat sample keys or UI controls as real credentials." requires="Secure hashed tokens, scopes, rotation, revocation and audit logging" />;
}
