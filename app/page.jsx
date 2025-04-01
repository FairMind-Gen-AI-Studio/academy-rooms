import MeetingRoomList from './components/MeetingRoomList';

export default function Home() {
  return (
    <div>
      <header className="p-4">
        <h1>Meeting Room Booking</h1>
      </header>

      <MeetingRoomList />
    </div>
  );
}