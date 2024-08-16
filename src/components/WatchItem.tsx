import React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Separator } from "./ui/separator";
import { classEntry } from "@/lib/types";

type Props = {
  code: classEntry;
  removeItem: (classCode: number) => void;
};

const WatchItem = ({ code, removeItem }: Props) => {
  return (
    <div>
      <div className="flex flex-row justify-between items-center hover:bg-gray-900 transition-all p-2 gap-4">
        <div className="flex flex-row gap-2 w-full">
          <Badge variant="default" className="font-bold w-20 justify-center">
            {`${code?.course}`}{" "}
          </Badge>
          <span className="font-bold">{code?.code}</span>
          {code.details?.enrolled !== undefined &&
            code.details?.enrollCap !== undefined && (
              <Badge
                className={`${
                  code.status === "open"
                    ? "dark:bg-emerald-500"
                    : "dark:bg-rose-500"
                } ml-auto`}
              >
                {code.details.enrolled}/{code.details.enrollCap}
              </Badge>
            )}
        </div>
        <Button
          variant="outline"
          className="w-8 h-8 text-xs"
          onClick={() => {
            removeItem(code.code);
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
