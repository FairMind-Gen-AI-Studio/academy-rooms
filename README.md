# Academy Rooms

A modern meeting room reservation and management system built with Next.js 14 and Supabase.

## Features

- 🗓️ **Real-time Meeting Room Calendar**: View and manage room bookings with an interactive calendar
- 🔍 **Advanced Room Filtering**: Filter rooms by name, capacity, and equipment
- 👥 **User Role Management**: Different access levels for regular users and administrators
- 🏢 **Room Management Dashboard**: Admin interface for creating, updating, and managing meeting rooms
- � **Responsive Design**: Optimized for all devices from mobile to desktop
- 🔄 **Real-time Updates**: Instant updates for bookings and room availability
- 🔒 **Authentication**: Secure user authentication with Clerk
- 🎨 **Modern UI**: Clean, accessible interface built with shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL database, authentication)
- **Authentication**: Clerk
- **State Management**: React Hooks
- **Form Handling**: Native React forms
- **Date Handling**: date-fns
- **Testing**: Jest, React Testing Library

## Project Structure

```
app/
├── actions/                  # Server actions for data fetching and mutations
│   ├── reservations.ts       # Reservation-related server actions
│   ├── rooms.ts              # Room-related server actions
│   └── rooms.test.ts         # Tests for room actions
├── admin/                    # Admin-only pages
│   ├── layout.tsx            # Admin layout wrapper
│   └── rooms/                # Room management pages
│       └── page.tsx          # Room management dashboard
├── api/                      # API routes
│   ├── reservations/         # Reservation API endpoints
│   └── rooms/                # Room API endpoints
├── components/               # React components
│   ├── admin/                # Admin-specific components
│   │   └── RoomManagement.tsx # Room management interface
│   ├── BookingModal.jsx      # Modal for creating/editing bookings
│   ├── MeetingRoomCalendar.jsx # Calendar view for room bookings
│   ├── MeetingRoomFilter.jsx # Filtering interface for rooms
│   ├── MeetingRoomList.jsx   # List of available meeting rooms
│   └── Navigation.tsx        # Main navigation component
├── context/                  # React context providers
├── fonts/                    # Custom font files
├── globals.css               # Global CSS styles
├── layout.tsx                # Root layout component
└── page.jsx                  # Homepage
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/academy-rooms.git
   cd academy-rooms
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Testing

Run the test suite with:

```bash
npm test
# or
yarn test
```

For test coverage:

```bash
npm run test:coverage
# or
yarn test:coverage
```

## Deployment

This application can be easily deployed on Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure the environment variables
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
