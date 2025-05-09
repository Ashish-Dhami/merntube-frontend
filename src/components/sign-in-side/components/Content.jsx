import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import { NavLink } from 'react-router-dom';
import { Logo } from '../../';

const items = [
  {
    icon: <SettingsSuggestRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Adaptable performance',
    description:
      'Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.',
  },
  {
    icon: <ConstructionRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Built to last',
    description:
      'Experience unmatched durability that goes above and beyond with lasting investment.',
  },
  {
    icon: <ThumbUpAltRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Great user experience',
    description:
      'Integrate our product into your routine with an intuitive and easy-to-use interface.',
  },
  {
    icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Innovative functionality',
    description:
      'Stay ahead with features that set new standards, addressing your evolving needs better than the rest.',
  },
];

export default function ScrollingContent() {
  const [isPaused, setIsPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const stackRef = React.useRef(null);
  const lastTimeRef = React.useRef(null);

  React.useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    let animationFrame;
    const duration = 20000; // 20 seconds for full scroll

    const animate = (time) => {
      if (isPaused) {
        lastTimeRef.current = time;
        return;
      }

      if (!lastTimeRef.current) lastTimeRef.current = time;
      const elapsed = time - lastTimeRef.current;
      lastTimeRef.current = time;

      setProgress((prev) => {
        const newProgress = prev + elapsed / duration;
        return newProgress;
      });

      const translateY = (progress % 1) * 50;
      stack.style.transform = `translateY(-${translateY}%)`;

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused, progress]);

  return (
    <Stack sx={{ alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'flex-end',
          columnGap: '4px',
          marginBottom: '12px',
        }}
      >
        <NavLink to="/">
          <Logo className="mx-auto transition-[scale] duration-200 ease-in hover:scale-110" />
        </NavLink>
        <NavLink to="/">
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#e5e7eb' }}
          >
            MERN
            <Box
              component="span"
              sx={{
                fontSize: '1.25rem',
                lineHeight: '1.625rem',
                color: '#ff0033',
              }}
            >
              Tube
            </Box>
          </Typography>
        </NavLink>
      </Box>
      <Box
        sx={{
          height: 400,
          overflow: 'hidden',
          maxWidth: 450,
          alignSelf: 'center',
          position: 'relative',
          padding: 2,
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          lastTimeRef.current = null;
        }}
      >
        <Stack
          ref={stackRef}
          sx={{
            flexDirection: 'column',
            gap: 4,
            width: '100%',
            willChange: 'transform',
            minHeight: '200%',
          }}
        >
          {[...items, ...items, ...items].map((item, index) => (
            <Stack key={index} direction="row" sx={{ gap: 2, minHeight: 80 }}>
              {item.icon}
              <div>
                <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {item.description}
                </Typography>
              </div>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
