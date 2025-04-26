export const ThemeIcon = ({
  dataTheme = '',
  className = '',
  label = '',
  selected = false,
}) => {
  return (
    <>
      <div
        data-theme={dataTheme}
        className={`bg-base-100 border-base-content/10 grid shrink-0 grid-cols-2 gap-0.5 rounded-md border p-1 shadow-sm ${className}`}
      >
        <div className="bg-base-content size-1 rounded-full"></div>
        <div className="bg-primary size-1 rounded-full"></div>
        <div className="bg-secondary size-1 rounded-full"></div>
        <div className="bg-accent size-1 rounded-full"></div>
      </div>
      {label && <div className="truncate">{label}</div>}
      {selected && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-3 w-3 shrink-0"
        >
          <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
        </svg>
      )}
    </>
  );
};
