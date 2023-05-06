import React from 'react';
import { ProtectedRoute } from './protected-route';
import { render } from '@testing-library/react';

test('renders ProtectedRoute component', () => {
  const mockChildren = <div>Test Child Component</div>;

  const { getByText } = render(<ProtectedRoute>{mockChildren}</ProtectedRoute>);

  expect(getByText('Test Child Component')).toBeInTheDocument();
});
