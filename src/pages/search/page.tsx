import { Link } from 'atomic-router-react';
import { routes } from '../../shared/routing.ts';

export const SearchPage = () => {
  return (
    <>
      <div>Search</div>
      <Link to={routes.auth.login}>Route link</Link>
      <Link to={routes.auth.register}>Route lin1k</Link>
    </>
  );
};
