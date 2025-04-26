export default function Loader({ className = '' }) {
  return (
    <div className={`text-center text-white opacity-60 ${className}`}>
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}
