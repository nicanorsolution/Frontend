export class ApiErrorResponse {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
}

/* export class ResponseError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.detail);
    this.name = 'ResponseError';
  }

  get statusCode(): number {
    return this.response.status;
  }

  get errorDetail(): string {
    return this.response.detail;
  }

  get errorTitle(): string {
    return this.response.title;
  }
} */
