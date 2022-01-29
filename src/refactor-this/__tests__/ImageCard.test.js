import { render, screen } from "@testing-library/react";

import ImageCard, { describePhoto } from "../components/ImageCard";

describe("ImageCard", () => {
  test("describes fixture names for screen readers", () => {
    expect(describePhoto("nature_4")).toBe("Nature photo 4");
    expect(describePhoto("architecture_23")).toBe("Architecture photo 23");
    expect(describePhoto("holiday.jpg")).toBe("holiday.jpg");
  });

  test("renders an image with a labelled same-origin download link", () => {
    render(
      <ImageCard
        name="fashion_12"
        url="/static/images/fashion/fashion_12.jpeg"
        frame={12}
      />
    );

    expect(screen.getByRole("img", { name: "Fashion photo 12" })).toHaveAttribute(
      "src",
      "/static/images/fashion/fashion_12.jpeg"
    );

    const download = screen.getByRole("link", { name: "Download Fashion photo 12" });
    expect(download).toHaveAttribute("href", "/static/images/fashion/fashion_12.jpeg");
    expect(download).toHaveAttribute("download", "fashion_12");
    expect(screen.getByText("12")).toBeInTheDocument();
  });
});
