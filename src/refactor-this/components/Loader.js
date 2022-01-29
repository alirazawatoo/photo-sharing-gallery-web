const PLACEHOLDERS = Array.from({ length: 9 }, (_, i) => i);

const Loader = () => (
  <div data-testid="loader" role="status">
    <span className="visually-hidden">Loading photos</span>
    <div className="sheet" aria-hidden="true">
      {PLACEHOLDERS.map((i) => (
        <div className="frame frame-placeholder" key={i}>
          <div className="frame-film" />
          <div className="frame-caption" />
        </div>
      ))}
    </div>
  </div>
);

export default Loader;
