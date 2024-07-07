// import { lazy } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { store } from "./redux/store.js";

import App from "./App.jsx";
import "./index.css";
import AllProjects from "./pages/AllProjects.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Home from "./pages/Home.jsx";
import ProjectBoard from "./pages/ProjectBoard.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import CreateProject from "./pages/CreateProject.jsx";


// // lazy loading or dynamic import
// // const AddNewArticle = lazy(() => import("./pages/AddNewArticle.jsx"));
// // const SignUp = lazy(() => import("./pages/SignUp.jsx"));
// // const Article = lazy(() => import("./pages/Article.jsx"));


createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter basename="">
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Home />}>
            <Route path="projects" element={<AllProjects />} />
            <Route path="project-board" element={<ProjectBoard />} />
            <Route path="create-project" element={<CreateProject />} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
