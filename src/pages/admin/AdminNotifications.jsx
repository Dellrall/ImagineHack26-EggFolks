import NotificationItem from '../../components/admin/NotificationItem';
import { adminNotifications } from '../../data/adminMockData';

export default function AdminNotifications() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-secondary">
          Notifications Center
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Organization-wide Alerts</h2>
      </div>
      <div className="space-y-4">
        {adminNotifications.map((notification) => (
          <NotificationItem key={notification.title} notification={notification} />
        ))}
      </div>
    </div>
  );
}
