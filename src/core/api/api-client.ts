export interface ApiClient {
  get<T>(url: string, options?: RequestInit): Promise<T>;
  post<T>(url: string, body: string, options?: RequestInit): Promise<T>;
  put<T>(url: string, body: string, options?: RequestInit): Promise<T>;
  delete<T>(url: string, options?: RequestInit): Promise<T>;
}

export class DefaultApiClient implements ApiClient {
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    this.checkForErrors(response);
    const data = await response.json();
    return data as T;
  }

  async post<T>(url: string, body: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    this.checkForErrors(response);
    const data = await response.json();
    return data as T;
  }

  async put<T>(url: string, body: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      body,
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    this.checkForErrors(response);
    const data = await response.json();
    return data as T;
  }

  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    this.checkForErrors(response);
    const data = await response.json();
    return data as T;
  }
  private checkForErrors(response: Response) {
    if (!response.ok) {
      throw new Error(`POST failed: ${response.statusText}`);
    }
  }
}
