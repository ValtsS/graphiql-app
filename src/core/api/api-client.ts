export interface RequestInitExtended extends RequestInit {
  /** Disable exception throwing on not-OK response. */
  DisableThrowOnError?: boolean;
}

export interface ApiClient {
  get<T>(url: string, options?: RequestInitExtended): Promise<T>;
  post<T>(url: string, body: string, options?: RequestInitExtended): Promise<T>;
  put<T>(url: string, body: string, options?: RequestInitExtended): Promise<T>;
  delete<T>(url: string, options?: RequestInitExtended): Promise<T>;
}

const enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export class DefaultApiClient implements ApiClient {
  async get<T>(url: string, options?: RequestInitExtended): Promise<T> {
    const response = await fetch(url, options);
    this.checkForErrors(response, HTTPMethod.GET, options);
    const data = await response.json();
    return data as T;
  }

  async post<T>(url: string, body: string, options?: RequestInitExtended): Promise<T> {
    const method = HTTPMethod.POST;
    const response = await fetch(url, {
      method,
      body,
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    this.checkForErrors(response, method, options);
    const data = await response.json();
    return data as T;
  }

  async put<T>(url: string, body: string, options?: RequestInitExtended): Promise<T> {
    const method = HTTPMethod.PUT;
    const response = await fetch(url, {
      method,
      body,
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    this.checkForErrors(response, method, options);
    const data = await response.json();
    return data as T;
  }

  async delete<T>(url: string, options?: RequestInitExtended): Promise<T> {
    const method = HTTPMethod.DELETE;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    this.checkForErrors(response, method, options);
    const data = await response.json();
    return data as T;
  }
  private checkForErrors(response: Response, method: HTTPMethod, options?: RequestInitExtended) {
    if (!response.ok && !(options?.DisableThrowOnError === true)) {
      throw new Error(`${method} failed: ${response.statusText}`);
    }
  }
}
