export default function Button({
  text,
  className,
  clickHandler,
  overwriteStyle = false,
  type = 'button',
  aceternity = false,
  ...props
}) {
  return !aceternity ? (
    <button
      className={`btn ${overwriteStyle ? '' : 'btn-xs sm:btn-sm md:btn-md lg:btn-lg'} ${className}`}
      onClick={clickHandler}
      type={type}
      {...props}
    >
      {text}
    </button>
  ) : (
    <button
      className={`relative inline-flex h-9 min-w-20 overflow-hidden rounded-full p-[1px] focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 focus:ring-offset-slate-50 focus:outline-none ${className} ${props?.disabled ? 'pointer-events-none opacity-40' : ''}`}
      onClick={clickHandler}
      type={type}
      {...props}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        {text}
      </span>
    </button>
  );
}
