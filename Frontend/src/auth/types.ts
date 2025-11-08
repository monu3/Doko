export interface FieldErrors {
  email?: string;
  password?: string;
  [key: string]: string | undefined;
}

// Define the shape of our auth state
export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  ownerId: string | null; // Store ownerId
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  fieldErrors: FieldErrors | null; // Specific field errors
}

