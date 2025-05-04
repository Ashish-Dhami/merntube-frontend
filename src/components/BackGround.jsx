import { useDispatch, useSelector } from 'react-redux';
import Background from '../enums/Background';
import { cn } from '@/lib/utils';
import { useState, useEffect, memo } from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Grid4x4OutlinedIcon from '@mui/icons-material/Grid4x4Outlined';
import BlurOnOutlinedIcon from '@mui/icons-material/BlurOnOutlined';
import SquareIcon from '@mui/icons-material/Square';
import { changeBackground } from '../store/Slices/backgroundSlice';

function BackGround() {
  const background = useSelector((state) => state.background.value.value);
  const [mainComponent, setMainComponent] = useState(null);

  useEffect(() => {
    if (background === Background.PLAIN.value) setMainComponent(null);

    if (background === Background.GRID.value) {
      setMainComponent(
        <div
          className={cn(
            'absolute inset-0',
            '[background-size:20px_20px]',
            '[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]',
            'dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]'
          )}
        />
      );
    }
    if (background === Background.DOT.value) {
      setMainComponent(
        <div
          className={cn(
            'absolute inset-0',
            '[background-size:20px_20px]',
            '[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]',
            'dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]'
          )}
        />
      );
    }
  }, [background]);

  return (
    mainComponent && (
      <>
        {mainComponent}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)] dark:bg-black"></div>
      </>
    )
  );
}

export const BackgroundToggleGroup = () => {
  const background = useSelector((state) => state.background.value.value);
  const dispatch = useDispatch();

  const handleBackground = (event, newBackground) => {
    if (newBackground !== null) {
      Object.keys(Background).some((key) => {
        if (Background[key].value === newBackground) {
          dispatch(changeBackground(Background[key]));
          return true;
        }
        return false;
      });
    }
  };

  return (
    <ToggleButtonGroup
      value={background}
      size="small"
      exclusive
      onChange={handleBackground}
      aria-label="Toggle background selection"
      className="justify-center"
    >
      <ToggleButton
        value={Background.GRID.value}
        aria-label={Background.GRID.label}
        title={Background.GRID.label}
      >
        <Grid4x4OutlinedIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton
        value={Background.DOT.value}
        aria-label={Background.DOT.label}
        title={Background.DOT.label}
      >
        <BlurOnOutlinedIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton
        value={Background.PLAIN.value}
        aria-label={Background.PLAIN.label}
        title={Background.PLAIN.label}
      >
        <SquareIcon fontSize="small" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default memo(BackGround);
