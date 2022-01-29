import { API_BASE_URL } from "../constants/url";

// The API answers with absolute http://localhost:8888 URLs. Keeping only the
// path routes images through the same origin as the page (via the dev-server
// proxy); a cross-origin <a download> is ignored and just opens the image.
const toSameOriginUrl = (url) => {
  const { pathname, search } = new URL(url, window.location.href);
  return pathname + search;
};

export const getImages = (category, page = 1, { signal } = {}) => {
  // Validate inputs early to avoid sending malformed requests to the legacy API.
  if (typeof category !== "string" || category.trim() === "") {
    throw new TypeError("category must be a non-empty string");
  }

  if (!Number.isInteger(page) || page < 1) {
    throw new TypeError("page must be an integer >= 1");
  }

  const encodedCategory = encodeURIComponent(category);
  const url = `${API_BASE_URL}/images?category=${encodedCategory}&page=${page}`;

  return fetch(url, { signal })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Image API responded with ${response.status}`);
      }
      return response.json();
    })
    .then((images) =>
      images.map((image) => ({ ...image, url: toSameOriginUrl(image.url) }))
    );
};
