import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Root from './pages/Root.jsx';
import Engine from './pages/Engine.jsx';
import Documentation from './pages/Documentation.jsx';
import Status from './pages/Status.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        path: '/',
        Component: Engine
      },
      {
        path: '/documentation',
        Component: Documentation
      },
      {
        path: 'status',
        Component: Status
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
