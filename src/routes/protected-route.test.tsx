import { FirebaseMock, SetupFirebaseMock } from '@/../__mocks__/firebaseMock';
import { waitRender } from '@/../__mocks__/test-utils';
import { AppContextProvider } from '@/provider';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { AccessMode } from './routes-config';

describe('Protected Route', () => {
  const mockChildrenText = 'Test Child Component';
  const rootText = 'Redirected';

  it.each([
    [true, AccessMode.Always, true],
    [false, AccessMode.Always, true],
    [true, AccessMode.LoggedIn, true],
    [false, AccessMode.LoggedIn, false],
    [false, AccessMode.Guest, true],
    [true, AccessMode.Guest, false],
  ])(
    'Test protected route loggedin=%s to be in mode=%s to be granted=%s',
    async (loggedIn: boolean, mode: AccessMode, granted: boolean) => {
      const auth = SetupFirebaseMock(loggedIn);
      const { getByText, queryByText } = defaultRender(auth, mode);
      if (granted) expect(getByText(mockChildrenText)).toBeInTheDocument();
      else {
        await waitRender();
        expect(queryByText(mockChildrenText)).not.toBeInTheDocument();
        expect(getByText(rootText)).toBeInTheDocument();
      }
    }
  );

  function defaultRender(auth: FirebaseMock, mode: AccessMode) {
    return render(
      <AppContextProvider apiClient={null} auth={auth}>
        <MemoryRouter initialEntries={['/auth', '/']} initialIndex={0}>
          <Routes>
            <Route
              path={'/auth'}
              element={
                <ProtectedRoute mode={mode} redirectTo="/">
                  <div>{mockChildrenText}</div>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<>{rootText}</>}></Route>
          </Routes>
        </MemoryRouter>
      </AppContextProvider>
    );
  }
});
