import { useSelector } from 'react-redux';
import { LoginPopup } from './';

export default function AuthChecker({ children }) {
  const authStatus = useSelector((state) => state.user.authStatus);

  if (!authStatus) {
    return <LoginPopup />;
  }
  return children;
}
