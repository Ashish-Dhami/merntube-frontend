import { useId, useState, forwardRef } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton } from '@mui/material';

function Input(
  { type = 'text', placeholder = 'Type here', className = '', label, ...props },
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
      {type === 'password' && (
        <IconButton
          edge="end"
          size="small"
          sx={{ position: 'absolute', right: 10, bottom: 7 }}
          onClick={handleClick}
        >
          {!showPassword ? (
            <Visibility fontSize="inherit" />
          ) : (
            <VisibilityOff fontSize="inherit" />
          )}
        </IconButton>
      )}
    </>
  );
}

export default forwardRef(Input);
