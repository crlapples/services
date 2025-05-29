// src/types/redirect.ts
export interface RedirectCallbacks {
    postFlowUrl: string; // URL after completing the flow (e.g., payment success)
    serviceListUrl: string; // URL for service list (e.g., /bookings)
    planListUrl: string; // URL for plan list (e.g., /plans)
  }