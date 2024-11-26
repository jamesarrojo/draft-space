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
import { useState } from 'react';

export default function TableStatus({ tableNumber, isOccupied }) {
  const [amount, setAmount] = useState(null);
  return (
    <Card className="flex flex-col px-2">
      <CardHeader>
        <CardTitle className="text-xl text-center">
          Table {tableNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p>{isOccupied ? '🔴 Occupied' : '🟢 Available'}</p>
      </CardContent>
      <CardFooter>
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="flex-grow">Reserve</Button>
          </DrawerTrigger>
          <DrawerContent className="flex flex-col items-center">
            <DrawerHeader>
              <DrawerTitle className="text-center">
                Pick a date to reserve Table {tableNumber}{' '}
                {amount && `— Total amount to pay is ₱${amount}`}
              </DrawerTitle>
              <DrawerDescription className="text-center">
                Payment is via Gcash. Reservation expires after 10 minutes not
                being paid.
              </DrawerDescription>
            </DrawerHeader>
            <BookReservation
              tableNumber={tableNumber}
              amount={amount}
              setAmount={setAmount}
            />
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" className="w-[280px] mb-10">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardFooter>
    </Card>
  );
}
