/**
 * Global API configurations and base service helpers
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}
