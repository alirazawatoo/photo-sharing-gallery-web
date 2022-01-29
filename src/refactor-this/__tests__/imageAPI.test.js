import { getImages } from "../API/imageAPI";
import { API_BASE_URL } from "../constants/url";

const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(body),
});

describe("imageAPI", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  test("encodes category and passes the correct page to the legacy API", async () => {
    const images = [{ name: "nature_7", url: "u7" }];
    fetch.mockResolvedValue(jsonResponse(images));

    await expect(getImages("nature & sea", 3)).resolves.toEqual(images);
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/images?category=nature%20%26%20sea&page=3`,
      { signal: undefined }
    );
  });

  test("forwards an abort signal", async () => {
    fetch.mockResolvedValue(jsonResponse([]));
    const controller = new AbortController();

    await getImages("nature", 1, { signal: controller.signal });

    expect(fetch.mock.calls[0][1]).toEqual({ signal: controller.signal });
  });

  test("rejects when the API answers with an error status", async () => {
    fetch.mockResolvedValue(jsonResponse({ error: "bad" }, 400));

    await expect(getImages("nature", 1)).rejects.toThrow("responded with 400");
  });

  test("throws for invalid category", () => {
    expect(() => getImages("", 1)).toThrow(TypeError);
    expect(() => getImages(null, 1)).toThrow(TypeError);
    expect(() => getImages(123, 1)).toThrow(TypeError);
  });

  test("throws for invalid page", () => {
    expect(() => getImages("nature", 0)).toThrow(TypeError);
    expect(() => getImages("nature", -1)).toThrow(TypeError);
    expect(() => getImages("nature", 1.5)).toThrow(TypeError);
  });
});
