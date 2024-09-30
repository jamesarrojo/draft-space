'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import { Button } from './ui/button';
import BookReservation from './BookReservation';

export default function TableStatus({ tableNumber, isOccupied }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Table {tableNumber}</CardTitle>
      </CardHeader>
      {/* <CardContent>
        <p>Card Content</p>
      </CardContent> */}
      <CardFooter>
        <p>{isOccupied ? '🔴 Occupied' : '🟢 Available'}</p>
        {/* <Button>Reserve</Button> */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Reserve</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                Pick a date to reserve Table {tableNumber}
              </DrawerTitle>
              <DrawerDescription>
                Payment is via Gcash. Reservation expires after 10 minutes not
                being paid.
              </DrawerDescription>
            </DrawerHeader>
            <BookReservation tableNumber={tableNumber} />
            <DrawerFooter>
              {/* <Button>Submit</Button> */}
              <DrawerClose>
                Cancel
                {/* <Button variant="outline">Cancel</Button> */}
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardFooter>
    </Card>
  );
}
