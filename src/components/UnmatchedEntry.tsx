import React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Separator } from "./ui/separator";
import { classEntry, watchEntry } from "@/lib/types";

type Props = {
  code: watchEntry;
  removeItem: (classCode: number) => void;
};

const UnmatchedEntry = ({ code, removeItem }: Props) => {
  return (
    <div className="h-max">
      <div className="flex flex-row justify-between items-center hover:bg-gray-900 transition-all p-2 gap-4 w-[20.5rem]">
        <div className="flex flex-row gap-2 w-full">
          <Badge variant="default" className="font-bold w-20 justify-center">
            {`${code.course}`}
          </Badge>
          <span className="font-bold">{code.code}</span>
        </div>
        <Button
          variant="outline"
          className="w-8 h-8 text-xs"
          onClick={(e) => {
            removeItem(code.code);
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

export default UnmatchedEntry;
