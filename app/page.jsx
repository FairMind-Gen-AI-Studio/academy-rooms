import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import MeetingRoomList from './components/MeetingRoomList';

export default function Home() {
  return (
    <div>
      <header className="flex justify-between items-center p-4">
        <h1>Meeting Room Booking</h1>
        
        <div>
          <SignedIn>
            <UserButton afterSignOutUrl="/"/>
          </SignedIn>
          <SignedOut>
            <SignInButton/>
          </SignedOut>
        </div>
      </header>

      <MeetingRoomList />
    </div>
  );
} 