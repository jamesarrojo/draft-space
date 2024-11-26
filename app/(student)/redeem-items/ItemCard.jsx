/* eslint-disable @next/next/no-img-element */
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import ToggleAvailability from './ToggleAvailability';
// import DeleteItem from './DeleteItem';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function ItemCard({
  name,
  imageUrl,
  description,
  pointsCost,
  itemId,
  studentPoints,
  studentId,
}) {
  console.log(studentPoints);
  const [quantity, setQuantity] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [totalCost, setTotalCost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const newRedemption = {
      student_id: studentId,
      quantity,
      item_id: itemId,
      total_points: totalCost,
    };
    console.log('SUBMIT IS CLICKED', newRedemption);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/redemptions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRedemption),
      }
    );

    const { error } = await res.json();
    if (error) {
      setErrorMsg(error.slice(0, 27));
      setIsLoading(false);
      return;
    }
    // I moved the trigger for the toast here
    toast({
      title: `Item redemption request has been submitted.`,
      description: `You may now claim your (${quantity}) ${name} at the DraftSpace branch.`,
    });
    setIsLoading(false);
    setErrorMsg(null);
    setQuantity(0);
    setTotalCost(null);
    if (res.status === 200) {
      router.refresh();
    }
  }
  return (
    <form onSubmit={handleSubmit} className="justify-self-stretch self-stretch">
      <Card className="lg:max-w-72">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <img
            src={imageUrl}
            width={150}
            height={150}
            alt={description}
            className="max-h-36 w-auto mx-auto"
          />

          <p>Points Cost: {pointsCost}</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Input
            className={
              errorMsg &&
              'border-red-500 focus:border-red-500 focus:ring-red-500'
            }
            type="number"
            placeholder="Points Cost"
            value={quantity}
            min={0}
            max={1000}
            onChange={(e) => {
              setQuantity(+e.target.value);
              setTotalCost(+e.target.value * pointsCost);
              setErrorMsg(null);
            }}
            required={true}
          />
          <Button
            type="submit"
            disabled={quantity === 0 || isLoading}
            className="self-stretch"
          >
            Submit
          </Button>
          <p className={`text-xs ${errorMsg && 'text-red-600'}`}>
            {quantity > 0 && !errorMsg
              ? `Total points cost is ${quantity} x ${pointsCost} = ${totalCost}`
              : errorMsg && errorMsg}
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
