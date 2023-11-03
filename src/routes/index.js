import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import { useAuth } from 'global';

import { pages } from './pages';

const Layout = ({ layout: Layout, isPublic }) => {
  const auth = useAuth();
  if (isPublic === true || !!auth.user)
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  return <Navigate to="/auth/login" />;
};

const Page = ({ title, component: Comp, ...props }) => {
  const auth = useAuth();

  useEffect(() => {
    auth.setTitlePage('titles.' + title || '');
  }, [title, auth]);

  if (typeof Comp === 'string') {
    return <Navigate to={Comp} />;
  }
  return <Comp {...props} />;
};
const Pages = () => (
  <HashRouter>
    <Routes>
      {pages.map(({ layout, isPublic, child }, index) => (
        <Route key={index} element={<Layout layout={layout} isPublic={isPublic} />}>
          {child.map(({ path, title, component }, subIndex) => (
            <Route exact key={path + subIndex} path={path} element={<Page title={title} component={component} />} />
          ))}
        </Route>
      ))}
    </Routes>
  </HashRouter>
);

export default Pages;
