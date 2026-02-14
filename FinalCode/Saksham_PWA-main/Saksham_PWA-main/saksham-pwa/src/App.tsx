import { useEffect } from 'react';
import { Route, Switch } from 'wouter';
import { initDB } from './lib/db';

// Pages
import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { NewEvent } from './pages/NewEvent';
import { EventDetail } from './pages/EventDetail';
import { DailyReport } from './pages/DailyReport';
import { Attendance } from './pages/Attendance';
import { Media } from './pages/Media';
import { Profile } from './pages/Profile';

function App() {
  useEffect(() => {
    // Initialize IndexedDB on app load
    initDB().catch(console.error);
  }, []);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/events" component={Events} />
      <Route path="/events/new" component={NewEvent} />
      <Route path="/events/:eventId/day/:dayNumber" component={DailyReport} />
      <Route path="/events/:id" component={EventDetail} />
      <Route path="/attendance" component={Attendance} />
      <Route path="/media" component={Media} />
      <Route path="/profile" component={Profile} />
      <Route>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-indian-blue mb-4">404</h1>
            <p className="text-gray-600">Page not found</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

export default App;
