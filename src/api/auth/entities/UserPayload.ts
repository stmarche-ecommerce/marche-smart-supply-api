export interface UserPayload {
  id: string;
  sub?: string;
  iat?: number;
  exp?: number;
  role: string;
}
