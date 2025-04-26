import { toast } from 'react-toastify';

const useDelay = async (response, MIN_DELAY = 900, showToast = true) => {
  const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_DELAY));
  const delayedResponse = await Promise.all([minDelay, response]).then(
    ([, response]) => response?.data
  );

  if (showToast) toast.success(delayedResponse?.message);
  return delayedResponse?.data;
};

export default useDelay;
