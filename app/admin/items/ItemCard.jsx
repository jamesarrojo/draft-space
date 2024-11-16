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

export default function ItemCard({
  name,
  imageUrl,
  isAvailable,
  description,
  pointsCost,
  id,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <img src={imageUrl} width={150} height={150} alt={description} />
        {isAvailable ? (
          <Badge>in stock</Badge>
        ) : (
          <Badge variant="destructive">out of stock</Badge>
        )}
        <p>Points Cost: {pointsCost}</p>
      </CardContent>
      <CardFooter>
        <ToggleAvailability id={id}>
          {isAvailable ? 'Make Unavailable' : 'Make Available'}
        </ToggleAvailability>
      </CardFooter>
    </Card>
  );
}
