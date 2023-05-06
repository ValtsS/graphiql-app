export interface ApiClient {
  get<T>(url: string, options?: RequestInit): Promise<T>;
  post<T>(url: string, body: string, options?: RequestInit): Promise<T>;
  put<T>(url: string, body: string, options?: RequestInit): Promise<T>;
  delete<T>(url: string, options?: RequestInit): Promise<T>;
}

const enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export class DefaultApiClient implements ApiClient {
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    this.checkForErrors(response, HTTPMethod.GET);
    const data = await response.json();
    return data as T;
  }

  async post<T>(url: string, body: string, options?: RequestInit): Promise<T> {
    const method = HTTPMethod.POST;
    const response = await fetch(url, {
      method,
      body,
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    this.checkForErrors(response, method);
    const data = await response.json();
    return data as T;
  }

  async put<T>(url: string, body: string, options?: RequestInit): Promise<T> {
    const method = HTTPMethod.PUT;
    const response = await fetch(url, {
      method,
      body,
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    this.checkForErrors(response, method);
    const data = await response.json();
    return data as T;
  }

  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    const method = HTTPMethod.DELETE;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    this.checkForErrors(response, method);
    const data = await response.json();
    return data as T;
  }
  private checkForErrors(response: Response, method: HTTPMethod) {
    if (!response.ok) {
      throw new Error(`${method} failed: ${response.statusText}`);
    }
  }
}
