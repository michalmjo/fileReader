export interface appUser {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
  displayName?: string;
  kind?: string;
}
