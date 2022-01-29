import { Link, Route, Routes } from "react-router";

import CategoryScreen from "../screens/CategoryScreen";
import { CATEGORIES } from "../constants/general";

const NotFound = () => (
  <main className="page">
    <title>Not found · Photo Sharing Gallery</title>
    <div className="notice">
      <h1 className="page-title">Nothing developed here</h1>
      <p>
        There is no gallery at this address. <Link to="/">Back to Nature</Link>
      </p>
    </div>
  </main>
);

const AppRouter = () => (
  <Routes>
    {CATEGORIES.map(({ slug, label, path }) => (
      <Route
        key={slug}
        path={path}
        element={<CategoryScreen key={slug} category={slug} label={label} />}
      />
    ))}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRouter;
