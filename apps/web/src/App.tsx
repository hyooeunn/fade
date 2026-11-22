import { useRoute } from './lib/router';
import { CoverPage } from './pages/CoverPage';
import { TodayPage } from './pages/TodayPage';
import { WeekPage } from './pages/WeekPage';

export function App() {
  const route = useRoute();

  switch (route.name) {
    case 'day':
      return <TodayPage date={route.date} />;
    case 'week':
      return <WeekPage date={route.date} />;
    default:
      return <CoverPage />;
  }
}
