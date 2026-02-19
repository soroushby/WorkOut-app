"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function WorkoutDatePicker({ date }: { date: Date }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleSelect(d: Date | undefined) {
    if (!d) return;
    setOpen(false);
    router.push(`/dashboard?date=${format(d, "yyyy-MM-dd")}`);
    router.refresh();
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2" suppressHydrationWarning>
          <CalendarIcon className="size-4" />
          {format(date, "do MMM yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent id="workout-date-picker" className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
