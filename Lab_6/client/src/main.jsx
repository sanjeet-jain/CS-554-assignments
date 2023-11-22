import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ComicList from "@/components/ComicList.jsx";
import Comic from "@/components/Comic.jsx";
import Collections from "@/components/Collections.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/marvel-comics/page/:pageNum",
        element: <ComicList />,
      },
      {
        path: "/marvel-comics/collections",
        element: <Collections />,
      },
      {
        path: "/marvel-comics/:id",
        element: <Comic />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
