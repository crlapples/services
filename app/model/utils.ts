// src/services/utils.ts
export const safeCall = async <T>(
  callback: () => Promise<T>,
  defaultValue: T,
  context?: string
): Promise<{
  data: T;
  hasError: boolean;
  errorMsg?: string;
}> => {
  try {
    const data = await callback();
    return { data, hasError: false };
  } catch (error) {
    console.error(`Error in ${context || 'safeCall'}:`, error);
    return {
      data: defaultValue,
      hasError: true,
      errorMsg: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};