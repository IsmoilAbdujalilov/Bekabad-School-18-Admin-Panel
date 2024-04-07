import Routes from "./Routes";
import { Spin, Flex } from "antd";
import { lazy, Suspense, CSSProperties } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Home = lazy(() => import("pages/Home"));
const News = lazy(() => import("pages/News"));
const Login = lazy(() => import("pages/Login"));
const Error = lazy(() => import("pages/Error"));
const Event = lazy(() => import("pages/Event"));
const Course = lazy(() => import("pages/Course"));
const Teacher = lazy(() => import("pages/Teacher"));
const Library = lazy(() => import("pages/Library"));
const Products = lazy(() => import("pages/Products"));
const EditNews = lazy(() => import("pages/EditNews"));
const Settings = lazy(() => import("pages/Settings"));
const EditCourse = lazy(() => import("pages/EditCourse"));
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
      {
        element: <News />,
        path: "/pages/news",
      },

      {
        element: <Course />,
        path: "/pages/course",
      },

      {
        element: <Event />,
        path: "/pages/event",
      },
      {
        element: <Teacher />,
        path: "/pages/teacher",
      },
      {
        element: <Library />,
        path: "/pages/library",
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
  {
    element: <EditNews />,
    path: "/pages/news/:id",
  },
  {
    element: <EditCourse />,
    path: "/pages/course/:id",
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
