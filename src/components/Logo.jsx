const Logo = ({ className = '' }) => {
  return (
    <div>
      <img
        src="/logo.png"
        alt="MERNTube Logo"
        className={`h-10 w-10 object-cover ${className}`}
      />
    </div>
  );
};

export default Logo;
