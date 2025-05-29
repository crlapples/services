// src/utils/redirect.utils.ts
import { RedirectCallbacks } from 'lib/redirect-types';

export const createRedirectCallbacks = ({
  baseUrl,
  postFlowUrl = baseUrl,
}: {
  baseUrl: string;
  postFlowUrl?: string;
}): RedirectCallbacks => {
  const fixedBaseUrl = baseUrl.replace(/\/$/, '');
  return {
    postFlowUrl,
    serviceListUrl: `${fixedBaseUrl}/bookings`,
    planListUrl: `${fixedBaseUrl}/plans`,
  };
};