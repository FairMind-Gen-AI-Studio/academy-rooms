import RoomManagement from '@/app/components/admin/RoomManagement';

export const metadata = {
  title: 'Room Management - Academy Rooms',
  description: 'Manage meeting rooms in the system',
};

export default function RoomManagementPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Room Management</h1>
      <RoomManagement />
    </div>
  );
}