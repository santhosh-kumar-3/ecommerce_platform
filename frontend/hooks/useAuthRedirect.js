import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

export default function useAuthRedirect() {
  const { token } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace('/(auth)/login');
    }
  }, [token]);
}
