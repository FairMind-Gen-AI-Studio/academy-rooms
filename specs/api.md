# API Tasks for SalaPrenotazioni with Supabase

## 1. Supabase Setup
- [ ] Create new Supabase project
- [ ] Set up database tables:
  ```sql
  -- Rooms table
  create table rooms (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    capacity integer not null,
    equipment text[] not null default '{}',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- Reservations table
  create table reservations (
    id uuid default uuid_generate_v4() primary key,
    room_id uuid references rooms(id) not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone not null,
    status text not null check (status in ('booked', 'tentative', 'cancelled')),
    organizer text not null,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );
  ```
- [ ] Set up Row Level Security (RLS) policies
- [ ] Create API keys and environment variables

## 2. Next.js API Routes Setup

### Rooms API
- [ ] `GET /api/rooms`
  - List all rooms
  - Support filtering by capacity and equipment
- [ ] `GET /api/rooms/[id]`
  - Get single room details
- [ ] `POST /api/rooms`
  - Create new room
- [ ] `PUT /api/rooms/[id]`
  - Update room details
- [ ] `DELETE /api/rooms/[id]`
  - Delete room

### Reservations API
- [ ] `GET /api/reservations`
  - List all reservations
  - Support filtering by date range and room
- [ ] `GET /api/reservations/[id]`
  - Get single reservation details
- [ ] `POST /api/reservations`
  - Create new reservation
  - Include conflict checking
- [ ] `PUT /api/reservations/[id]`
  - Update reservation
  - Include conflict checking
- [ ] `DELETE /api/reservations/[id]`
  - Cancel reservation

## 3. Supabase Client Setup
- [ ] Install Supabase client: `npm install @supabase/supabase-js`
- [ ] Create utils/supabase.js client helper
- [ ] Set up environment variables:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=your-project-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```

## 4. Frontend Integration
- [ ] Update MeetingRoomList to fetch from API
- [ ] Update MeetingRoomCalendar to fetch from API
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add optimistic updates

## 5. Authentication (Optional)
- [ ] Set up Supabase Auth
- [ ] Create protected API routes
- [ ] Add login/signup pages
- [ ] Update RLS policies for authenticated access

## 6. Testing
- [ ] Write API tests
- [ ] Test room creation/update/deletion
- [ ] Test reservation creation with conflict checking
- [ ] Test filtering and search functionality

## 7. Deployment
- [ ] Set up environment variables in production
- [ ] Deploy to Vercel/other platform
- [ ] Test production environment
- [ ] Monitor for errors

## API Endpoints Detail

### GET /api/rooms
// Query parameters
interface RoomFilters {
capacity?: number;
equipment?: string[];
search?: string;
}
// Response
interface Room {
id: string;
name: string;
capacity: number;
equipment: string[];
created_at: string;
}


### GET /api/reservations
// Query parameters
interface ReservationFilters {
room_id?: string;
start_date?: string;
end_date?: string;
status?: 'booked' | 'tentative' | 'cancelled';
}
// Response
interface Reservation {
id: string;
room_id: string;
start_time: string;
end_time: string;
status: 'booked' | 'tentative' | 'cancelled';
organizer: string;
notes?: string;
created_at: string;
}
```