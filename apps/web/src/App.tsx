import { useRoute } from './lib/router';
import { CoverPage } from './pages/CoverPage';

export function App() {
  const route = useRoute();

  switch (route.name) {
    default:
      return <CoverPage />;
  }
}
