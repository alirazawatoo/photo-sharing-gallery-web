const Loader = () => (
  <div data-testid="loader" className="loader" role="status">
    <span className="loader-spinner" aria-hidden="true" />
    <span className="visually-hidden">Loading photos</span>
  </div>
);

export default Loader;
