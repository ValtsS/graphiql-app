import { defaultRoutes } from '@/routes/routes-config';
import React, { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import './header.css';

export const Header = (): ReactElement => {
  return (
    <>
      <header>
        <nav>
          <ul>
            {defaultRoutes.map(
              (route) =>
                route.displayInMenu && (
                  <li key={'ul_' + route.path + route.menuText}>
                    <NavLink to={route.path} key={'link_' + route.menuText + route.path}>
                      {route.menuText}
                    </NavLink>
                  </li>
                )
            )}
          </ul>
        </nav>
      </header>
    </>
  );
};
