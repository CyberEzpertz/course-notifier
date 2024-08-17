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
  const watchList = useRef<watchEntry[]>([]);
  const oldData = useRef<classEntry[]>([]);

  const { data, dataUpdatedAt, refetch, error } = useQuery({
    queryKey: ["fetch-codes", watchList.current],
    queryFn: async () => fetchCourses(watchList.current),
    refetchInterval: (1 / 6) * 60000,
    refetchIntervalInBackground: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const addClass = (courseCode: string, classCode: string) => {
    const code = Number(classCode);
    const exists = watchList.current.filter(
      (existing) => existing.code === code
    );

    if (exists.length > 0 || courseCode.length !== 7) return;

    watchList.current = [
      ...watchList.current,
      { code: code, course: courseCode.toUpperCase() },
    ];

    localStorage.setItem("classCodes", JSON.stringify(watchList.current));
    refetch();
  };

  const removeClass = (classCode: number) => {
    watchList.current = watchList.current.filter(
      (code) => code.code !== classCode
    );
    localStorage.setItem("classCodes", JSON.stringify(watchList.current));
    refetch();
  };

  useEffect(() => {
    const stored = localStorage.getItem("classCodes");
    const parsed = stored !== null ? JSON.parse(stored) : null;

    Notification.requestPermission();

    if (parsed) {
      watchList.current = parsed;
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

      watchList.current = data.map((entry) => {
        return {
          code: entry.details?.code as number,
          course: entry.details?.course as string,
        };
      });

      oldData.current = data;
    }
  }, [data]);

  return (
    <div className="flex flex-col w-max min-h-full items-center justify-center gap-4">
      <CourseInput addClass={addClass} />
      <Card className="flex flex-col w-full h-1/2">
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
          <CardDescription>
            {"Classes that you're currently watching are here"}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-y-auto flex flex-wrap max-w-[64.5rem]">
          {data?.length !== 0 ? (
            data?.map((entry) => (
              <WatchItem
                key={entry.details?.code}
                code={entry}
                removeItem={removeClass}
              />
            ))
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
        </CardFooter>
      </Card>
    </div>
  );
};

export default CourseList;
