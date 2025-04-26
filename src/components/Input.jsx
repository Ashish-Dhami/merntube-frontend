import { useId, useState, forwardRef } from 'react';
import { FaRegEye, FaRegEyeSlash } from '../icons';

function Input(
  {
    type = 'text',
    placeholder = 'Type here',
    className = '',
    label,
    iconClassName = '',
    ...props
  },
  ref
) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [localType, setLocalType] = useState(type);

  const handleClick = () => {
    if (!showPassword) {
      setLocalType('text');
    } else {
      setLocalType('password');
    }
    setShowPassword((prev) => !prev);
  };
  return (
    <>
      {label && (
        <label className="fieldset-label m-1" htmlFor={id}>
          {label}
        </label>
      )}
      {type !== 'textarea' ? (
        <input
          type={localType}
          id={id}
          placeholder={placeholder}
          className={`input border-0 bg-inherit ${type === 'password' && 'pr-11'} ${className}`}
          ref={ref}
          {...props}
        />
      ) : (
        <textarea
          id={id}
          rows="4"
          className={`textarea bg-inherit ${className}`}
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
      )}
      {type === 'password' &&
        (!showPassword ? (
          <FaRegEyeSlash
            className={`absolute right-4 bottom-3 cursor-pointer text-xl hover:scale-105 hover:text-white ${iconClassName}`}
            onClick={handleClick}
          />
        ) : (
          <FaRegEye
            className={`absolute right-4 bottom-3 cursor-pointer text-xl hover:scale-105 hover:text-white ${iconClassName}`}
            onClick={handleClick}
          />
        ))}
    </>
  );
}

export default forwardRef(Input);
