import { RouteConfig, defaultRoutes } from './routes-config';

describe('Route Configuration', () => {
  test('should have all the elements set', () => {
    defaultRoutes.every((route: RouteConfig) => {
      expect(route.uuid).toBeTruthy();
      expect(route.element()).toBeTruthy();
      expect(route.path.length).toBeGreaterThan(0);
      return true;
    });
  });
});
