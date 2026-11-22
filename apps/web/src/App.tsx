import { useRoute } from './lib/router';
import { CoverPage } from './pages/CoverPage';
import { TodayPage } from './pages/TodayPage';

export function App() {
  const route = useRoute();

  switch (route.name) {
    case 'day':
      return <TodayPage date={route.date} />;
    default:
      return <CoverPage />;
  }
}
