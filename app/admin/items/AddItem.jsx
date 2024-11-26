'use client';
import { useState } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function AddItem() {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [pointsCost, setPointsCost] = useState('');

  const { toast } = useToast();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    // not sure why I put these here (copied from AddTransaction)
    setName('');
    setImageUrl('');
    setDescription('');
    setPointsCost('');

    const newItem = {
      name,
      image_url: imageUrl,
      description,
      point_cost: pointsCost,
    };

    console.log('NEW ITEM', newItem);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/redeemable_items`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      }
    );

    const { data } = await res.json();

    // I moved the trigger for the toast here
    toast({
      title: `New item has been added.`,
      description: `${data.name} is now added to the list of redeemable items.`,
    });
    if (res.status === 200) {
      router.refresh();
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="mb-4">New Item</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <form onSubmit={handleSubmit}>
          <SheetHeader className="gap-2 mb-8">
            <SheetTitle>Add new item</SheetTitle>
            <SheetDescription>
              This will add a new redeemable item for students.
            </SheetDescription>

            <Input
              type="text"
              placeholder="Item Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={true}
            />
            <Input
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required={true}
            />
            <Input
              type="text"
              placeholder="Short Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required={true}
            />
            <Input
              type="number"
              placeholder="Points Cost"
              value={pointsCost}
              min={1}
              onChange={(e) => setPointsCost(+e.target.value)}
              required={true}
            />
          </SheetHeader>
          <SheetFooter className="sm:justify-start">
            <SheetClose asChild>
              <Button
                disabled={!name || !imageUrl || !description || !pointsCost}
                type="submit"
              >
                Submit
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
