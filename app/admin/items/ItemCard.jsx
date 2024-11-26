/* eslint-disable @next/next/no-img-element */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ToggleAvailability from './ToggleAvailability';
import DeleteItem from './DeleteItem';

export default function ItemCard({
  name,
  imageUrl,
  isAvailable,
  description,
  pointsCost,
  id,
}) {
  return (
    <div className="justify-self-stretch self-stretch">
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
          {isAvailable ? (
            <Badge>in stock</Badge>
          ) : (
            <Badge variant="destructive">out of stock</Badge>
          )}
          <p>Points Cost: {pointsCost}</p>
        </CardContent>
        <CardFooter className="flex gap-2 justify-between">
          <ToggleAvailability id={id}>
            {isAvailable ? 'Make Unavailable' : 'Make Available'}
          </ToggleAvailability>
          <DeleteItem id={id} className="">
            Delete
          </DeleteItem>
        </CardFooter>
      </Card>
    </div>
  );
}
