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
    <Card>
      <CardHeader>
        <CardTitle>
          {isApproved ? (
            <FaRegSmile color="green" />
          ) : (
            <FaRegSadTear color="red" />
          )}{' '}
          {email}
        </CardTitle>
        <CardDescription>
          {DateTime.fromISO(createdAt).toLocaleString(DateTime.DATETIME_FULL)}
        </CardDescription>
      </CardHeader>
      <CardContent>{feedback}</CardContent>
      <CardFooter>
        <DeleteFeedback id={id}>Delete</DeleteFeedback>
      </CardFooter>
    </Card>
  );
}
