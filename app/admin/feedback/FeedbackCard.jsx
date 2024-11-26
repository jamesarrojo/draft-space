/* eslint-disable @next/next/no-img-element */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import ToggleAvailability from './ToggleAvailability';
import DeleteFeedback from './DeleteFeedback';
import { DateTime } from 'luxon';
import { FaRegSmile, FaRegSadTear } from 'react-icons/fa';

export default function FeedbackCard({
  feedback,
  email,
  createdAt,
  id,
  isApproved,
}) {
  return (
    <Card className="self-stretch mx-4">
      <CardHeader>
        <CardTitle className="flex gap-2">
          {isApproved ? (
            <FaRegSmile className="text-green-600" />
          ) : (
            <FaRegSadTear className="text-red-600" />
          )}{' '}
          {email}
        </CardTitle>
        <CardDescription>
          {DateTime.fromISO(createdAt).toLocaleString(DateTime.DATETIME_FULL)}
        </CardDescription>
      </CardHeader>
      <CardContent className="my-8">{feedback}</CardContent>
      <CardFooter>
        <DeleteFeedback id={id}>Delete</DeleteFeedback>
      </CardFooter>
    </Card>
  );
}
