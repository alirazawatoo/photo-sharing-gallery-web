const Paginator = (props) => {
  const { next, prev, page, end, busy = false } = props;

  // Paging while a screen is still loading would race two fetches.
  const isPrevDisabled = busy || page === 1;
  const isNextDisabled = busy || Boolean(end);

  return (
    <div className="center">
      <ul className="pagination pagination-lg justify-content-center">
        <li className={`page-item ${isPrevDisabled ? "disabled" : ""}`}>
          <button
            type="button"
            className="page-link"
            disabled={isPrevDisabled}
            onClick={prev}
          >
            Previous
          </button>
        </li>
        <li className={`page-item ${isNextDisabled ? "disabled" : ""}`}>
          <button
            type="button"
            className="page-link"
            disabled={isNextDisabled}
            onClick={next}
          >
            Next
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Paginator;
