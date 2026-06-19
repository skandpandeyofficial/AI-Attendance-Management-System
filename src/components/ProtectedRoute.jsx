import PageNotFound from "./PageNotFound";

export default function ProtectedRoute({
  children,
  allowedRole,
}) {
  const role = localStorage.getItem("role");

  if (role !== allowedRole) {
    return <PageNotFound />;
  }

  return children;
}