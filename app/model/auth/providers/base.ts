export interface AuthProvider {
    login: (credentials: { email: string; password: string }) => Promise<AuthSession>;
    logout: () => Promise<void>;
    getSession: () => Promise<AuthSession | null>;
    // Add other auth methods you need
  }