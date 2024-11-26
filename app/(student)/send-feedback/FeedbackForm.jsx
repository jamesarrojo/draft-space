'use client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { FaRegSmile, FaRegSadTear } from 'react-icons/fa';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function FeedbackForm({ studentId }) {
  const [message, setMessage] = useState('');
  const [emotion, setEmotion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const newFeedback = {
      student_id: studentId,
      feedback: message,
      is_approved: emotion === 'happy' ? true : false,
    };
    console.log(newFeedback);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFeedback),
    });

    const { data } = await res.json();
    setMessage('');
    setEmotion(null);
    setIsLoading(false);
    // I moved the trigger for the toast here
    toast({
      title: `Your feedback has been sent!`,
      description: `We read all of the feedback sent to us to help us improve our service.`,
    });
    if (res.status === 200) {
      router.refresh();
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex-col max-w-96 mx-auto mt-12 p-4"
    >
      <h3 className="text-xl font-bold text-center my-2">
        How do you feel about DraftSpace?
      </h3>
      <RadioGroup
        value={emotion}
        onValueChange={setEmotion}
        className="flex justify-center my-4"
      >
        <div className="flex space-x-2">
          <RadioGroupItem className="hidden" value="happy" id="happy" />
          <Label htmlFor="happy">
            <FaRegSmile
              className={`cursor-pointer text-2xl ${
                emotion === 'happy' ? `text-green-600` : `hover:text-green-600`
              }`}
            />
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem className="hidden" value="sad" id="sad" />
          <Label htmlFor="sad">
            <FaRegSadTear
              className={`cursor-pointer text-2xl ${
                emotion === 'sad' ? `text-red-600` : `hover:text-red-600`
              }`}
            />
          </Label>
        </div>
      </RadioGroup>

      <Textarea
        placeholder="Write your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={emotion === null}
        className="my-4 min-h-36"
      />
      <Button
        disabled={!emotion || message === '' || isLoading}
        type="submit"
        className="w-full"
      >
        Submit
      </Button>
    </form>
  );
}
