export interface LinkData {
  error: boolean;
  id: string;
  idLowercase: string;
  url: string,
  caseSensitive: boolean;
  expiresAt?: Date;
  accessLimit?: number;
}