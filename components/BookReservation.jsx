'use client';

import { useState } from 'react';
import { DatePicker } from '@/components/ui/datepicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateTime } from 'luxon';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { DrawerClose } from '@/components/ui/drawer';

// returns an array of time slots that are already booked
function generateBookedTimes(startTimeStr, endTimeStr) {
  let bookedTimes = [];
  let currentTime = DateTime.fromISO(startTimeStr); // old (when I used the format `06:00 PM`)--> DateTime.fromFormat(startTimeStr, 'hh:mm a');
  const endTime = DateTime.fromISO(endTimeStr); // old --> DateTime.fromFormat(endTimeStr, 'hh:mm a');

  while (currentTime < endTime) {
    bookedTimes.push(currentTime.toFormat('hh:mm a'));
    currentTime = currentTime.plus({ hours: 1 });
  }

  return bookedTimes;
}

// returns an array of possible end times based on the selected start time
function getPossibleEndTimes(startTimeStr, reservations) {
  let endTimes = [];

  const newReservations = [...reservations, startTimeStr].sort(
    (a, b) =>
      DateTime.fromFormat(a, 'hh:mm a') - DateTime.fromFormat(b, 'hh:mm a')
  );

  const indexOfMaxEndTime =
    newReservations.indexOf(startTimeStr) === newReservations.length - 1
      ? null
      : newReservations.indexOf(startTimeStr) + 1;

  const maxEndTime =
    indexOfMaxEndTime === null
      ? '08:00 PM'
      : newReservations[indexOfMaxEndTime];
  let currentTime = DateTime.fromFormat(startTimeStr, 'hh:mm a');
  const endTime = DateTime.fromFormat(maxEndTime, 'hh:mm a');

  while (currentTime < endTime) {
    currentTime = currentTime.plus({ hours: 1 });
    endTimes.push(currentTime.toFormat('hh:mm a'));
  }

  return endTimes;
}

function toISOString(date, time) {
  // Parse the ISO string
  const dt = DateTime.fromISO(date);

  // Parse the new 12-hour format time (06:00 PM)
  const newTime = DateTime.fromFormat(time, 'hh:mm a');

  // Set the new time while keeping the same date and time zone
  const updatedDt = dt.set({ hour: newTime.hour, minute: newTime.minute });

  return updatedDt.toISO();
}

export default function BookReservation({ tableNumber, amount, setAmount }) {
  const [date, setDate] = useState(''); // holds the date selected
  const [reservations, setReservations] = useState([]); // holds the the array of booked time slots
  const [start, setStart] = useState(''); // holds the string start time in `hh:mm a` format
  const [end, setEnd] = useState(''); // holds the string end time in `hh:mm a` format
  const [endTimes, setEndTimes] = useState([]); // holds the array of possible end times
  const [calendarOpen, setCalendarOpen] = useState(false); // this is to for closing the popover element in the DatePicker component
  const [isLoading, setIsLoading] = useState(false);
  const [hours, setHours] = useState(undefined);

  const { toast } = useToast();

  // this function gets all the reservations for a given date
  async function getReservationsForDate(date) {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reservations?date=${date.slice(
        0,
        10
      )}&tableId=${tableNumber}`
    );

    const reservations = await data.json();
    if (!reservations.data) {
      return [];
    }
    // return reservations.data;
    return reservations.data.flatMap(({ start_time, end_time }) =>
      generateBookedTimes(start_time, end_time)
    );
  }

  async function handleDate(date) {
    // Parse the string using JavaScript's Date constructor
    const jsDate = new Date(date);
    // Convert to a Luxon DateTime object
    const dateTime = DateTime.fromJSDate(jsDate);
    // Convert to ISO format
    const isoString = dateTime.toISO();

    setCalendarOpen(false);
    setStart('');
    setEnd('');
    setAmount(null);
    setDate(isoString);
    const reservations = await getReservationsForDate(isoString);
    console.log(reservations);
    setReservations(reservations);
  }

  async function handleSubmit(e) {
    setIsLoading(true);
    e.preventDefault();

    const newReservation = {
      reservation_date: date,
      start_time: toISOString(date, start),
      end_time: toISOString(date, end),
      table_id: tableNumber,
      hours,
      amount,
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reservations`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReservation),
      }
    );

    if (res.status === 200) {
      toast({
        title: `Reservation request has been made to Table ${tableNumber}.`,
        description:
          'Please settle the payment within 10 minutes to confirm reservation, otherwise request will be auto deleted.',
      });
      setIsLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <DatePicker
          date={date}
          setDate={handleDate}
          calendarOpen={calendarOpen}
          setCalendarOpen={setCalendarOpen}
        />
        {date && (
          <Select
            onValueChange={(value) => {
              setEnd('');
              setAmount(null);
              setStart(value);
              // I changed `start` to `value` because I remembered a lesson from Josh
              setEndTimes(getPossibleEndTimes(value, reservations));
            }}
            value={start}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a start time" />
            </SelectTrigger>
            <SelectContent>
              {startTime.map((time) => {
                return (
                  <SelectItem
                    key={time}
                    value={time}
                    disabled={reservations.includes(time)}
                  >
                    {time}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
        {start && (
          <Select
            onValueChange={(value) => {
              const format = 'hh:mm a';

              // Parse the times using the format
              const dateTime1 = DateTime.fromFormat(start, format);
              const dateTime2 = DateTime.fromFormat(value, format);

              // Calculate the difference in minutes
              const diff = dateTime2
                .diff(dateTime1, ['hours', 'minutes'])
                .as('hours');
              const toPay = rate[diff > 8 ? 7 : diff - 1];
              console.log('DIFF', diff);
              setHours(diff);
              setAmount(toPay); // Get the difference in total minutes
              setEnd(value);
            }}
            value={end}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select an end time" />
            </SelectTrigger>
            <SelectContent>
              {endTime.map((time) => {
                return (
                  <SelectItem
                    key={time}
                    value={time}
                    disabled={
                      compareTwoTimes(start, time) || !endTimes.includes(time)
                    }
                  >
                    {time}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
        <DrawerClose asChild>
          <Button
            disabled={!date || !start || !end || isLoading}
            type="submit" // need to add this and the asChild on the `DrawerClose` above.
          >
            Submit
          </Button>
        </DrawerClose>
      </form>
    </>
  );
}

function compareTwoTimes(start, end) {
  return (
    DateTime.fromFormat(start, 'h:mm a') >= DateTime.fromFormat(end, 'h:mm a')
  );
}

const startTime = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
];
const endTime = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
];

const rate = [45, 85, 130, 175, 215, 260, 305, 350];
