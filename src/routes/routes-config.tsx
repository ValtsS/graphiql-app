import { Authorization, Main, Registration, Welcome } from '@/pages';
import React from 'react';
import { ProtectedRoute } from './protected-route';
import { v4 as uuidv4 } from 'uuid';

export interface RouteConfig {
  uuid: string;
  path: string;
  element: React.ReactNode;
  displayInMenu?: boolean;
  menuText?: string;
  menuTextRu?: string;
  displayInRegistration?: boolean;
}

const regRoutes: RouteConfig[] = [
  {
    uuid: uuidv4(),
    path: '/auth',
    element: (
      <ProtectedRoute>
        <Authorization />
      </ProtectedRoute>
    ),
    displayInMenu: true,
    menuText: 'Sign in',
    menuTextRu: 'Войти',
    displayInRegistration: true,
  },
  {
    uuid: uuidv4(),
    path: '/reg',
    element: (
      <ProtectedRoute>
        <Registration />
      </ProtectedRoute>
    ),
    displayInMenu: true,
    menuText: 'Sign up',
    menuTextRu: 'Зарегистрироваться',
    displayInRegistration: true,
  },
];

export const defaultRoutes: RouteConfig[] = [
  {
    uuid: uuidv4(),
    path: '/welcome',
    element: <Welcome routes={regRoutes} />,
    displayInMenu: true,
    menuText: 'Welcome',
    menuTextRu: 'Приветствие',
  },
  {
    uuid: uuidv4(),
    path: '/',
    element: <Main />,
    displayInMenu: true,
    menuText: 'Main',
    menuTextRu: 'Главная',
  },
  ...regRoutes,
];
