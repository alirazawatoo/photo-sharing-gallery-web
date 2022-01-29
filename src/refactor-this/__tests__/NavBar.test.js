import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import NavBar from "../components/NavBar";
import AppRouter from "../router";
import { getImages } from "../API/imageAPI";

jest.mock("../API/imageAPI", () => ({
  getImages: jest.fn(() => new Promise(() => {})),
}));

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <NavBar />
      <AppRouter />
    </MemoryRouter>
  );

describe("navigation", () => {
  test("links every category and marks the current one", () => {
    renderAt("/architecture");

    const nav = screen.getByRole("navigation", { name: "Categories" });
    const links = within(nav).getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual([
      "Nature",
      "Architecture",
      "Fashion",
    ]);
    expect(within(nav).getByRole("link", { name: "Architecture" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(within(nav).getByRole("link", { name: "Nature" })).not.toHaveAttribute(
      "aria-current"
    );
  });

  test("loads the category that matches the route", () => {
    renderAt("/fashion");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Fashion");
    expect(getImages).toHaveBeenCalledWith("fashion", 1, expect.anything());
  });

  test("shows a not-found page for unknown paths", () => {
    renderAt("/../static/images");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Nothing developed here"
    );
  });
});
