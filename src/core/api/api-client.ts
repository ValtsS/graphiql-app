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
    const method = HTTPMethod.GET;
    const promise = fetch(url, options);
    const data = await promise.then((response) => {
      this.checkForErrors(response, method, options);
      return response.json();
    });

    return data as T;
  }

  async post<T>(url: string, body: string, options?: RequestInitExtended): Promise<T> {
    const method = HTTPMethod.POST;
    const promise = fetch(url, {
      method,
      body,
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    const data = await promise.then((response) => {
      this.checkForErrors(response, method, options);
      return response.json();
    });

    return data as T;
  }

  async put<T>(url: string, body: string, options?: RequestInitExtended): Promise<T> {
    const method = HTTPMethod.PUT;
    const promise = fetch(url, {
      method,
      body,
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    const data = await promise.then((response) => {
      this.checkForErrors(response, method, options);
      return response.json();
    });

    return data as T;
  }

  async delete<T>(url: string, options?: RequestInitExtended): Promise<T> {
    const method = HTTPMethod.DELETE;
    const promise = fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const data = await promise.then((response) => {
      this.checkForErrors(response, method, options);
      return response.json();
    });

    return data as T;
  }

  private checkForErrors(response: Response, method: HTTPMethod, options?: RequestInitExtended) {
    if (!response.ok && !(options?.DisableThrowOnError === true)) {
      throw new Error(`${method} failed: ${response.statusText}`);
    }
  }
}
