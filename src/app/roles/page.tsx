import UnavailableFeature from "@/components/UnavailableFeature";

export default function Page() {
  return <UnavailableFeature title="Roles and permissions" description="Displayed role labels are examples only. There is no verified production role/permission enforcement; the current release uses one private-preview administrator." requires="User accounts, tenant membership, server-side RBAC and negative access tests" />;
}
