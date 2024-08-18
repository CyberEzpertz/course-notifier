"use client";

import { classEntry, watchEntry } from "@/lib/types";
import { fetchCourses, tellServer } from "@/server-actions/fetch-courses";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import CourseInput from "./CourseInput";
import WatchItem from "./WatchItem";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const compareStatus = (oldData: classEntry[], newData: classEntry[]) => {
  const changelist = [];

  for (const entry of newData) {
    const classCode = entry.details?.code;
    const pairedEntry = oldData.find(
      (oldEntry) => oldEntry.details?.code === classCode
    );

    if (
      !pairedEntry ||
      !pairedEntry.status ||
      pairedEntry.status === entry.status
    )
      continue;

    changelist.push({
      course: entry.details?.course,
      section: entry.details?.section,
      status: entry.status,
    });
  }

  return changelist;
};

const CourseList = () => {
  const [id, setId] = useState<string>("");
  const [watched, setWatched] = useState<watchEntry[]>([]);
  const oldData = useRef<classEntry[]>([]);

  const { data, dataUpdatedAt, refetch, error, isFetching } = useQuery({
    queryKey: ["fetch-codes", watched, id],
    queryFn: async () => fetchCourses(watched, id),
    refetchInterval: 1 * 60000,
    refetchIntervalInBackground: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const addClass = (courseCode: string, classCode: string) => {
    const code = Number(classCode);
    const exists = watched.filter((existing) => existing.code === code);

    if (exists.length > 0 || courseCode.length !== 7) return;

    const newWatched = [
      ...watched,
      { code: code, course: courseCode.toUpperCase() },
    ].toSorted((a, b) => a.course.localeCompare(b.course));

    setWatched(newWatched);

    localStorage.setItem("classCodes", JSON.stringify(newWatched));
  };

  const removeClass = (classCode: number) => {
    const newWatched = watched.filter((code) => code.code !== classCode);
    localStorage.setItem("classCodes", JSON.stringify(newWatched));

    setWatched(newWatched);
  };

  const handleId = (formData: FormData) => {
    const idNumber = formData.get("idNumber") as string;
    localStorage.setItem("idNumber", JSON.stringify(idNumber));
    setId(idNumber);
  };

  useEffect(() => {
    const stored = localStorage.getItem("classCodes");
    const storedId = localStorage.getItem("idNumber");

    const parsed = stored !== null ? JSON.parse(stored) : null;
    const parsedId = storedId !== null ? JSON.parse(storedId) : null;

    Notification.requestPermission();

    if (parsed) {
      setWatched(parsed);
    }

    if (parsedId) {
      setId(parsedId);
    }
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      const changelist = compareStatus(oldData.current, data);

      if (changelist.length !== 0) {
        const body = changelist.reduce((acc, change) => {
          acc += `[${change.course}] ${change.section} ${
            change.status === "open" ? "🟢" : "🔴"
          }\n`;
          return acc;
        }, "");

        new Notification("Course status updated!", {
          body: body,
        });
      }

      oldData.current = data;
    }
  }, [data]);

  return (
    <div className="flex flex-col w-max min-h-full items-center justify-center gap-4">
      <CourseInput addClass={addClass} />
      <Card className="flex flex-col w-full h-1/2">
        <CardHeader className="flex-row flex space-y-0 justify-between">
          <div>
            <CardTitle>Watchlist</CardTitle>
            <CardDescription>
              {"Classes that you're currently watching are here"}
            </CardDescription>
          </div>
          <form action={handleId}>
            <div className="flex flex-row gap-4 items-center">
              <Label htmlFor="idNumber" className="text-nowrap">
                ID Number
              </Label>
              <Input
                id="idNumber"
                name="idNumber"
                type="text"
                placeholder="12312345"
              />
              <Button type="submit" className="gap-2">
                {id.length === 0 ? "Set ID" : "Change ID"}
              </Button>
            </div>
          </form>
        </CardHeader>
        <CardContent className="overflow-y-auto flex flex-wrap max-w-[64.5rem]">
          {watched?.length !== 0 ? (
            watched?.map((entry) => {
              const entryDetail = data?.find(
                (dataEntry) => dataEntry.details?.code === entry.code
              );

              return (
                <WatchItem
                  key={entry.code}
                  watch={entry}
                  details={entryDetail}
                  removeItem={removeClass}
                />
              );
            })
          ) : (
            <span className="text-gray-500 italic">
              No class codes added yet...
            </span>
          )}
        </CardContent>
        <CardFooter className="text-gray-500 text-sm mt-auto">
          {`Last Updated: ${new Date(dataUpdatedAt).toLocaleTimeString()}`}
          {error && (
            <span className="text-gray-500 italic pl-4">
              An error occurred, trying to fetch data again...
            </span>
          )}
          <span className="ml-auto">
            ID Number: {id.length === 0 ? "None" : id}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CourseList;
