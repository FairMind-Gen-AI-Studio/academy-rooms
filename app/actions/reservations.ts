'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

type ReservationStatus = 'booked' | 'tentative' | 'cancelled'

export async function getReservations(filters?: {
  room_id?: string
  start_date?: string
  end_date?: string
  status?: ReservationStatus
}) {
  const supabase = createClient()
  let query = supabase.from('reservations').select('*')

  if (filters?.room_id) {
    query = query.eq('room_id', filters.room_id)
  }

  if (filters?.start_date) {
    query = query.gte('start_time', filters.start_date)
  }

  if (filters?.end_date) {
    query = query.lte('end_time', filters.end_date)
  }

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query.order('start_time', { ascending: true })
  
  if (error) throw new Error(error.message)
  return data
}

export async function getReservation(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

async function checkConflicts(
  roomId: string,
  startTime: string,
  endTime: string,
  excludeReservationId?: string
) {
  const supabase = createClient()
  let query = supabase
    .from('reservations')
    .select('id, start_time, end_time')
    .eq('room_id', roomId)
    .eq('status', 'booked')

  if (excludeReservationId) {
    query = query.neq('id', excludeReservationId)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  // Check for overlaps manually
  return data.some(reservation => {
    const resStart = new Date(reservation.start_time).getTime()
    const resEnd = new Date(reservation.end_time).getTime()
    const newStart = new Date(startTime).getTime()
    const newEnd = new Date(endTime).getTime()

    return (newStart < resEnd && newEnd > resStart)
  })
}

export async function createReservation(data: {
  room_id: string
  start_time: string
  end_time: string
  organizer: string
  notes?: string
  status: ReservationStatus
}) {
  const hasConflicts = await checkConflicts(
    data.room_id,
    data.start_time,
    data.end_time
  )

  if (hasConflicts) {
    throw new Error('Time slot is already booked')
  }

  const supabase = createClient()
  const { error } = await supabase.from('reservations').insert([data])

  if (error) throw new Error(error.message)
  revalidatePath('/reservations')
  revalidatePath(`/rooms/${data.room_id}`)
}

export async function updateReservation(
  id: string,
  data: {
    start_time?: string
    end_time?: string
    organizer?: string
    notes?: string
    status?: ReservationStatus
  }
) {
  const supabase = createClient()
  
  // Get current reservation to check room_id if times are being updated
  if (data.start_time || data.end_time) {
    const { data: currentReservation, error: fetchError } = await supabase
      .from('reservations')
      .select('room_id, start_time, end_time')
      .eq('id', id)
      .single()

    if (fetchError) throw new Error(fetchError.message)

    const hasConflicts = await checkConflicts(
      currentReservation.room_id,
      data.start_time || currentReservation.start_time,
      data.end_time || currentReservation.end_time,
      id
    )

    if (hasConflicts) {
      throw new Error('Time slot is already booked')
    }
  }

  const { error } = await supabase
    .from('reservations')
    .update(data)
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/reservations')
  revalidatePath(`/reservations/${id}`)
}

export async function deleteReservation(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/reservations')
} 