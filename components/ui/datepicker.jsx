'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DateTime } from 'luxon';

export function DatePicker({ date, setDate, calendarOpen, setCalendarOpen }) {
  return (
    // fixed the datepicker not picking any date by using `modal={true}
    // from this: https://github.com/shadcn-ui/ui/issues/910#issuecomment-2007924837
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          // initialFocus commented out this because datepicker does pop up when clicking it
          disabled={(date) => date < new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}
