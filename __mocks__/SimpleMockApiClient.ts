import { ApiClient, RequestInitExtended } from '../src/core/api/api-client';

export type PostCallBack<T> = (method: string, url: string, body: string) => Promise<T>;

export class SimpleMockApiClient<T> implements ApiClient {
  private callback: PostCallBack<Promise<T>>;

  constructor(callback: PostCallBack<Promise<T>>) {
    this.callback = callback;
  }

  async get<T>(url: string, options?: RequestInitExtended | undefined): Promise<T> {
    const result = this.callback('GET', url, '');
    return result as Promise<T>;
  }
  async put<T>(url: string, body: string, options?: RequestInitExtended | undefined): Promise<T> {
    const result = this.callback('PUT', url, body);
    return result as Promise<T>;
  }
  async delete<T>(url: string, options?: RequestInitExtended | undefined): Promise<T> {
    const result = this.callback('DELETE', url, '');
    return result as Promise<T>;
  }

  async post<T>(url: string, body: string, options?: RequestInitExtended): Promise<T> {
    const result = this.callback('POST', url, body);
    return result as Promise<T>;
  }
}
