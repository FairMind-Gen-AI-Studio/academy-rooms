-- Add status column to rooms table
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available';

-- Add comment to the status column
COMMENT ON COLUMN public.rooms.status IS 'Current status of the room (available, booked, maintenance)';

-- Create an index on the status column for faster status-based queries
CREATE INDEX IF NOT EXISTS rooms_status_idx ON public.rooms (status);