import React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Separator } from "./ui/separator";
import { classEntry, watchEntry } from "@/lib/types";

type Props = {
  watch: watchEntry;
  details?: classEntry;
  removeItem: (classCode: number) => void;
};

const WatchItem = ({ watch, details, removeItem }: Props) => {
  return (
    <div className="h-max">
      <div className="flex flex-row justify-between items-center hover:bg-gray-900 transition-all p-2 gap-4 w-[20.5rem]">
        <div className="flex flex-row gap-2 w-full">
          <Badge variant="default" className="font-bold w-20 justify-center">
            {`${watch.course}`}
          </Badge>
          {details && (
            <Badge variant="outline" className="font-bold w-10 justify-center">
              {`${details.details?.section}`}
            </Badge>
          )}
          <span className="font-bold">{watch.code}</span>
          {details &&
            details.details?.enrolled !== undefined &&
            details.details?.enrollCap !== undefined && (
              <Badge
                className={`${
                  details.status === "open"
                    ? "dark:bg-emerald-500"
                    : "dark:bg-rose-500"
                } ml-auto`}
              >
                {details.details.enrolled}/{details.details.enrollCap}
              </Badge>
            )}
        </div>
        <Button
          variant="outline"
          className="w-8 h-8 text-xs"
          onClick={(e) => {
            removeItem(watch.code as number);
            e.currentTarget.disabled = true;
          }}
        >
          X
        </Button>
      </div>
      <Separator />
    </div>
  );
};

export default WatchItem;
