export interface CmsContentItem {
  id: string;
  type: string;
  slug: string;
  title: string;
  excerpt?: string;
  body?: string;
  imageUrl?: string;
  data?: Record<string, unknown>;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientPrincipal {
  identityProvider?: string;
  userId?: string;
  userDetails?: string;
  userRoles?: string[];
}

export interface CmsWritePayload {
  type?: unknown;
  slug?: unknown;
  title?: unknown;
  excerpt?: unknown;
  body?: unknown;
  imageUrl?: unknown;
  data?: unknown;
  published?: unknown;
  order?: unknown;
}
