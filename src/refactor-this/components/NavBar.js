import { Link, NavLink } from "react-router";

import { CATEGORIES } from "../constants/general";

const NavBar = () => (
  <header className="masthead">
    <Link className="brand" to="/">
      Photo Sharing <em>Gallery</em>
    </Link>
    <nav aria-label="Categories">
      <ul className="tabs">
        {CATEGORIES.map(({ slug, label, path }) => (
          <li key={slug}>
            <NavLink className="tab" to={path} end>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

export default NavBar;
