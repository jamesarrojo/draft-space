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

// returns an array of time slots that are already booked
function generateBookedTimes(startTimeStr, endTimeStr) {
  let bookedTimes = [];
  let currentTime = DateTime.fromFormat(startTimeStr, 'hh:mm a');
  const endTime = DateTime.fromFormat(endTimeStr, 'hh:mm a');

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

export default function BookReservation() {
  const [date, setDate] = useState(''); // holds the date selected
  const [reservations, setReservations] = useState([]); // holds the the array of booked time slots
  const [start, setStart] = useState(''); // holds the string start time in `hh:mm a` format
  const [end, setEnd] = useState(''); // holds the string end time in `hh:mm a` format
  const [endTimes, setEndTimes] = useState([]); // holds the array of possible end times
  const [calendarOpen, setCalendarOpen] = useState(false); // this is to for closing the popover element in the DatePicker component

  // this function gets all the reservations for a given date
  async function getReservationsForDate(date) {
    const data = await fetch(`http://localhost:3000/api/reservations/${date}`);

    const reservations = await data.json();

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
    setDate(isoString);
    const reservations = await getReservationsForDate(isoString);
    setReservations(reservations);
  }

  // should I make this component a server component ?
  return (
    <form>
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
            {startTime.map((time, index) => {
              if (
                DateTime.fromISO(date).weekday >= 6 &&
                (index === 0 || index === 11)
              ) {
                return null;
              }
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
        <Select onValueChange={(value) => setEnd(value)} value={end}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select an end time" />
          </SelectTrigger>
          <SelectContent>
            {endTime.map((time, index) => {
              if (
                DateTime.fromISO(date).weekday >= 6 &&
                (index === 0 || index === 11)
              ) {
                return null;
              }
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
    </form>
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
  '06:00 PM',
  '07:00 PM',
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
  '07:00 PM',
  '08:00 PM',
];
