import Routes from "./Routes";
import { Spin, Flex } from "antd";
import { lazy, Suspense, CSSProperties } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Home = lazy(() => import("pages/Home"));
const Login = lazy(() => import("pages/Login"));
const Error = lazy(() => import("pages/Error"));
const Products = lazy(() => import("pages/Products"));
const Settings = lazy(() => import("pages/Settings"));
const Categories = lazy(() => import("pages/Categories"));

const flexStyle: CSSProperties = { minHeight: "100vh" };

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Routes />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        element: <Products />,
        path: "/pages/products",
      },
      {
        element: <Categories />,
        path: "/pages/categories",
      },
    ],
  },
  {
    element: <Login />,
    path: "/pages/login",
  },
  {
    element: <Settings />,
    path: "/pages/settings",
  },
  {
    path: "*",
    element: <Error />,
  },
]);

const App = () => {
  return (
    <Flex justify="center" align="center" style={flexStyle}>
      <Suspense fallback={<Spin spinning={true} />}>
        <RouterProvider router={routes} />
      </Suspense>
    </Flex>
  );
};

export default App;
