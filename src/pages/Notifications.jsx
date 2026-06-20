import NotificationCard from '../components/NotificationCard';
import { notifications } from '../data/mockData';

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-secondary">Notifications</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Commute Alerts</h2>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
}
