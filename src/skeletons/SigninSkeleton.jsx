import { Skeleton, Stack } from '@mui/material';

export default function SigninSkeleton() {
  return (
    <Stack spacing={1}>
      <Skeleton variant="text" sx={{ fontSize: '3rem' }} width={300} />
      <Skeleton variant="rounded" height={78} />
      <Skeleton variant="text" sx={{ alignSelf: 'center' }} width={205} />
    </Stack>
  );
}
