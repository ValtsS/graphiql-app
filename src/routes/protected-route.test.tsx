import React from 'react';
import { ProtectedRoute } from './protected-route';
import { render } from '@testing-library/react';
import { AccessMode } from './routes-config';

test('renders ProtectedRoute component', () => {
  const mockChildren = 'Test Child Component';

  const { getByText } = render(
    <ProtectedRoute mode={AccessMode.Always}>
      <div>{mockChildren}</div>
    </ProtectedRoute>
  );

  expect(getByText(mockChildren)).toBeInTheDocument();
});
