import { ApiClient, DefaultApiClient } from './api-client';
import fetchMock from 'jest-fetch-mock';

describe('DefaultApiClient', () => {
  let apiClient: ApiClient;
  const dummyURL = 'https://www.googlexcxc.com/';

  beforeEach(() => {
    fetchMock.enableMocks();
    apiClient = new DefaultApiClient();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  test('get method should fetch data from the server', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: 'some data' }));
    const result = await apiClient.get<{ data: string }>(dummyURL);
    expect(result.data).toEqual('some data');
  });

  test('test network error', async () => {
    fetchMock.mockRejectOnce(new Error('Fetch error'));
    await expect(apiClient.get(dummyURL)).rejects.toThrowError('Fetch error');
  });

  test('should throw an error when server returns 500', async () => {
    fetchMock.mockOnce(dummyURL, { status: 500 });
    await expect(apiClient.get(dummyURL)).rejects.toThrowError('GET failed: Internal Server Error');
  });

  test('post method should send data to the server', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: 'some data' }));
    await apiClient.post<{ message: string }>(dummyURL, JSON.stringify({ message: 'hello' }));
    expect(fetchMock).toHaveBeenCalledWith(dummyURL, {
      body: JSON.stringify({ message: 'hello' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  });

  test('put method should update data on the server', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'data updated successfully' }));
    const result = await apiClient.put<{ message: string }>(
      dummyURL,
      JSON.stringify({ message: 'hello' })
    );
    expect(result.message).toEqual('data updated successfully');
    expect(fetchMock).toHaveBeenCalledWith(dummyURL, {
      body: JSON.stringify({ message: 'hello' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });
  });

  test('delete method should delete data from the server', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'data deleted successfully' }));
    const result = await apiClient.delete<{ message: string }>(dummyURL);
    expect(result.message).toEqual('data deleted successfully');
    expect(fetchMock).toHaveBeenCalledWith(dummyURL, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    });
  });
});
