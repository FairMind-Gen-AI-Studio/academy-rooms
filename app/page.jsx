import MeetingRoomList from './components/MeetingRoomList';
import UserMenu from './components/UserMenu';

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">SalaPrenotazioni</h1>
          <UserMenu />
        </div>
      </header>
      <main>
        <MeetingRoomList />
      </main>
    </div>
  );
}