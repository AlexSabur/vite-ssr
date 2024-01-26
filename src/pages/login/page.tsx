import { useEffect } from 'react';

import { pageMounted } from './model';

export function LoginPage() {
  useEffect(() => {
    pageMounted();
  }, []);

  return <div>Login</div>;
}
