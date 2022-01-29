import { useEffect, useState } from "react";

import { getImages } from "../API/imageAPI";
import ImageCard from "../components/ImageCard";
import Loader from "../components/Loader";
import Paginator from "../components/Paginator";

// The API caps every response at three images; one screen shows nine.
export const API_PAGES_PER_SCREEN = 3;
const IMAGES_PER_SCREEN = API_PAGES_PER_SCREEN * 3;

const apiPagesFor = (screenPage) => {
  const first = (screenPage - 1) * API_PAGES_PER_SCREEN + 1;
  // One extra page tells us whether another screen exists. Without it, a
  // category whose size is a multiple of nine leaves Next enabled on an
  // empty final screen.
  return Array.from({ length: API_PAGES_PER_SCREEN + 1 }, (_, i) => first + i);
};

const CategoryScreen = ({ category, label = category }) => {
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  // A result belongs to one request; until the current request's result
  // arrives, the screen is loading.
  const requestKey = `${category}/${page}/${attempt}`;
  const [result, setResult] = useState({
    key: null,
    status: "loading",
    images: [],
    hasMore: false,
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    Promise.all(
      apiPagesFor(page).map((apiPage) =>
        getImages(category, apiPage, { signal })
      )
    )
      .then((responses) => {
        if (signal.aborted) return;
        const probe = responses.pop();
        setResult({
          key: requestKey,
          status: "ready",
          images: responses.flat(),
          hasMore: probe.length > 0,
        });
      })
      .catch(() => {
        if (signal.aborted) return;
        setResult({
          key: requestKey,
          status: "error",
          images: [],
          hasMore: false,
        });
      });

    return () => controller.abort();
  }, [category, page, requestKey]);

  const status = result.key === requestKey ? result.status : "loading";
  const { images, hasMore } = result;
  const loading = status === "loading";

  const firstFrame = (page - 1) * IMAGES_PER_SCREEN + 1;

  let content;
  if (loading) {
    content = <Loader />;
  } else if (status === "error") {
    content = (
      <div className="notice" role="alert">
        <p>The photos could not be loaded. The image service may be down.</p>
        <button
          type="button"
          className="button"
          onClick={() => setAttempt((count) => count + 1)}
        >
          Try again
        </button>
      </div>
    );
  } else if (images.length === 0) {
    content = (
      <div className="notice">
        <p>No photos on this page.</p>
      </div>
    );
  } else {
    content = (
      <div className="sheet">
        {images.map((image, index) => (
          <ImageCard
            key={image.url}
            url={image.url}
            name={image.name}
            frame={firstFrame + index}
          />
        ))}
      </div>
    );
  }

  return (
    <main className="page">
      <title>{`${label} · Photo Sharing Gallery`}</title>
      <div className="page-heading">
        <h1 className="page-title">{label}</h1>
        {status === "ready" && images.length > 0 && (
          <p className="page-meta">
            Frames {firstFrame}–{firstFrame + images.length - 1}
          </p>
        )}
      </div>

      <section aria-busy={loading} aria-label={`${label} photos`}>
        {content}
      </section>

      <Paginator
        prev={() => setPage((prevPage) => prevPage - 1)}
        next={() => setPage((prevPage) => prevPage + 1)}
        page={page}
        end={!hasMore}
        busy={loading}
      />
    </main>
  );
};

export default CategoryScreen;
