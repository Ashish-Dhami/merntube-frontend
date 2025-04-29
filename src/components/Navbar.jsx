import { useDispatch, useSelector } from 'react-redux';
import {
  BackgroundToggleGroup,
  Button,
  CreateResourceBar,
  Input,
  Logo,
  AccountMenu,
} from './';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeIcon } from '../icons/ThemeIcon';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useForm } from 'react-hook-form';
import { useRef, memo } from 'react';
import Theme from '../enums/Theme';
import { changeTheme } from '../store/Slices/themeSlice';

function Navbar({ setSearchTerm }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.user.authStatus);
  const currTheme = useSelector((state) => state.theme.value.value);

  const themes = Object.keys(Theme);

  const changeThemeHandler = (themeKey) => {
    dispatch(changeTheme(Theme[themeKey]));
  };

  const { register, handleSubmit, reset, watch } = useForm();
  const searchTerm = watch('searchTerm', '');
  const inputRef = useRef(null);

  const handleHomeSearch = ({ searchTerm }) => {
    setSearchTerm(searchTerm?.trim() || '');
    navigate('/');
    inputRef?.current?.focus();
  };

  return (
    <div
      className={`navbar bg-base-100 sticky top-0 ${authStatus ? 'z-100' : 'z-1'} justify-between shadow-lg`}
    >
      <div>
        <Link
          to="/"
          className="btn btn-ghost flex items-end text-2xl"
          onClick={() => {
            reset({ searchTerm: '' });
            setSearchTerm('');
          }}
        >
          <Logo />
          MERN
          <span className="font-roboto -ml-1 text-lg leading-6.5 text-[#ff0033]">
            Tube
          </span>
        </Link>
      </div>
      <form
        className="join relative basis-[40%]"
        onSubmit={handleSubmit(handleHomeSearch)}
      >
        <Input
          type="text"
          placeholder="Search Home..."
          className="border-neutral join-item focus:border-info w-full rounded-l-full border-1 pr-8 focus:outline-none"
          maxLength="150"
          {...register('searchTerm')}
          ref={(e) => {
            register('searchTerm').ref(e); // Bind react-hook-form ref
            inputRef.current = e; // Bind our ref
          }}
        />
        {searchTerm && (
          <span
            className="absolute top-1 right-15"
            onClick={() => {
              reset({ searchTerm: '' });
              inputRef?.current?.focus();
            }}
          >
            <CloseRoundedIcon
              sx={{
                fontSize: 30,
                cursor: 'pointer',
                borderRadius: '100%',
                '&:hover': { backgroundColor: '#6a728227' },
              }}
            />
          </span>
        )}
        <button className="join-item btn rounded-r-full" type="submit">
          <SearchOutlinedIcon />
        </button>
      </form>
      <div className="font-roboto mr-3 flex items-center justify-end gap-x-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-sm btn-ghost tooltip tooltip-bottom gap-1"
            aria-label="Change Theme"
            data-tip="Change Theme"
          >
            <ThemeIcon />
            <ExpandMoreIcon fontSize="small" />
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-200 text-base-content rounded-box mt-3 h-50 w-40 flex-nowrap overflow-y-scroll border border-white/5 font-medium shadow-2xl outline-1 outline-black/5"
          >
            <li className="menu-title text-xs">Background</li>
            <BackgroundToggleGroup />
            <li className="menu-title text-xs">Theme</li>
            {themes.map((theme) => (
              <li key={theme}>
                <button
                  className="gap-3 px-2"
                  onClick={() => changeThemeHandler(theme)}
                >
                  <ThemeIcon
                    dataTheme={Theme[theme]?.value}
                    className="border-none"
                    label={Theme[theme]?.label}
                    selected={Theme[theme]?.value === currTheme}
                  />
                </button>
              </li>
            ))}
            <li></li>
          </ul>
        </div>
        {authStatus ? (
          <>
            <CreateResourceBar className="-order-1" />
            <AccountMenu />
          </>
        ) : (
          <>
            <Button
              text="SIGN IN"
              clickHandler={() => {
                navigate('/signin');
              }}
              aceternity={true}
            />
            <Button
              text="SIGN UP"
              clickHandler={() => {
                navigate('/signup');
              }}
              aceternity={true}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default memo(Navbar);
