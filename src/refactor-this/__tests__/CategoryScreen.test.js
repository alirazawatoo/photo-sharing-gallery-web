import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CategoryScreen from "../screens/CategoryScreen";
import { getImages } from "../API/imageAPI";

jest.mock("../API/imageAPI", () => ({
  getImages: jest.fn(),
}));

const deferred = () => {
  let resolve;
  let reject;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

const images = (prefix, count) =>
  Array.from({ length: count }, (_, i) => ({
    url: `/static/${prefix}_${i + 1}.jpeg`,
    name: `${prefix}_${i + 1}`,
  }));

// Serves a fixed list in API-sized pages of three, like the real server.
const serveCategory = (items) =>
  getImages.mockImplementation((category, page) =>
    Promise.resolve(items.slice((page - 1) * 3, page * 3))
  );

describe("CategoryScreen", () => {
  beforeEach(() => {
    getImages.mockReset();
  });

  test("waits for every request before rendering results", async () => {
    const pages = [deferred(), deferred(), deferred(), deferred()];
    pages.forEach((d) => getImages.mockReturnValueOnce(d.promise));

    render(<CategoryScreen category="nature" />);

    expect(getImages.mock.calls.map(([category, page]) => [category, page])).toEqual([
      ["nature", 1],
      ["nature", 2],
      ["nature", 3],
      ["nature", 4],
    ]);

    await act(async () => {
      pages[0].resolve([{ url: "u1", name: "img1" }]);
    });
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.queryByAltText("img1")).not.toBeInTheDocument();

    await act(async () => {
      pages[1].resolve([{ url: "u2", name: "img2" }]);
      pages[2].resolve([{ url: "u3", name: "img3" }]);
      pages[3].resolve([]);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    expect(screen.getByAltText("img1")).toBeInTheDocument();
    expect(screen.getByAltText("img2")).toBeInTheDocument();
    expect(screen.getByAltText("img3")).toBeInTheDocument();
  });

  test("disables Next on a short final screen", async () => {
    serveCategory(images("nature", 5));

    render(<CategoryScreen category="nature" />);

    expect(await screen.findAllByRole("img")).toHaveLength(5);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  test("disables Next when the category ends exactly on a full screen", async () => {
    serveCategory(images("fashion", 9));

    render(<CategoryScreen category="fashion" />);

    expect(await screen.findAllByRole("img")).toHaveLength(9);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  test("pages forward to the next nine images and back", async () => {
    const user = userEvent.setup();
    serveCategory(images("architecture", 23));

    render(<CategoryScreen category="architecture" />);

    expect(await screen.findAllByRole("img")).toHaveLength(9);
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(await screen.findByAltText("architecture_10")).toBeInTheDocument();
    expect(getImages).toHaveBeenCalledWith("architecture", 7, expect.anything());
    expect(screen.queryByAltText("architecture_1")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(await screen.findAllByRole("img")).toHaveLength(5);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(await screen.findByAltText("architecture_10")).toBeInTheDocument();
  });

  test("keeps both paging buttons disabled while a screen loads", async () => {
    getImages.mockReturnValue(new Promise(() => {}));

    render(<CategoryScreen category="nature" />);

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  test("shows an error with a working retry when a request fails", async () => {
    const user = userEvent.setup();
    getImages.mockRejectedValueOnce(new Error("Network error"));
    getImages.mockResolvedValue([]);

    render(<CategoryScreen category="nature" />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("could not be loaded");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();

    serveCategory(images("nature", 4));
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findAllByRole("img")).toHaveLength(4);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("shows an empty state when a page has no photos", async () => {
    getImages.mockResolvedValue([]);

    render(<CategoryScreen category="nature" />);

    expect(await screen.findByText("No photos on this page.")).toBeInTheDocument();
  });

  test("aborts in-flight requests on unmount", () => {
    getImages.mockReturnValue(new Promise(() => {}));

    const { unmount } = render(<CategoryScreen category="nature" />);
    const signal = getImages.mock.calls[0][2].signal;

    expect(signal.aborted).toBe(false);
    unmount();
    expect(signal.aborted).toBe(true);
  });
});
