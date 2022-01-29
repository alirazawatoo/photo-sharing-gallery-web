const Paginator = (props) => {
  const { next, prev, page, end, busy = false } = props;

  // Paging while a screen is still loading would race two fetches.
  const isPrevDisabled = busy || page === 1;
  const isNextDisabled = busy || Boolean(end);

  return (
    <nav className="pager" aria-label="Pages">
      <button
        type="button"
        className="button"
        disabled={isPrevDisabled}
        onClick={prev}
      >
        Previous
      </button>
      <span className="pager-status">Sheet {page}</span>
      <button
        type="button"
        className="button"
        disabled={isNextDisabled}
        onClick={next}
      >
        Next
      </button>
    </nav>
  );
};

export default Paginator;
