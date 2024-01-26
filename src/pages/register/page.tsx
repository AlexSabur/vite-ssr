import { useEffect } from 'react';

import { pageMounted } from './model';

export const RegisterPage = () => {
  useEffect(() => {
    pageMounted();
  }, []);

  return <div>Register</div>;
};
