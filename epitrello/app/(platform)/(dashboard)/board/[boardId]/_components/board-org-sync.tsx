"use client";

import { useEffect } from "react";

interface BoardOrgSyncProps {
  orgId: string;
}

export const BoardOrgSync = ({ orgId }: BoardOrgSyncProps) => {
  useEffect(() => {
    // Mettre à jour le cookie avec l'organisation du board
    fetch("/api/set-organization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId: orgId }),
    }).catch(console.error);
  }, [orgId]);

  return null;
};
