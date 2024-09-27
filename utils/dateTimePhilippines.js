import { DateTime } from 'luxon';

export function getCurrentPhilippineTime() {
  return DateTime.now().setZone('Asia/Manila').toISO();
}
