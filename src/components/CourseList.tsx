"use client";

import { classEntry } from "@/lib/types";
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

const CourseList = () => {
  const notifiedRef = useRef<boolean>(false);
  const [watched, setWatched] = useState<classEntry[]>([]);

  const { data, dataUpdatedAt, isRefetching } = useQuery({
    queryKey: ["fetch-codes", watched],
    queryFn: async () => fetchCourses(watched),
    refetchInterval: 1 * 60000,
    refetchIntervalInBackground: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const addClass = (courseCode: string, classCode: string) => {
    const code = Number(classCode);
    const exists = watched.filter((existing) => existing.code === code);

    if (exists.length > 0 || courseCode.length !== 7) return;

    const newCodes = [
      ...watched,
      { code: code, course: courseCode.toUpperCase() },
    ];

    setWatched(newCodes);
    localStorage.setItem("classCodes", JSON.stringify(newCodes));
  };

  const removeClass = (classCode: number) => {
    const newCodes = watched.filter((code) => code.code !== classCode);
    setWatched(newCodes);
    localStorage.setItem("classCodes", JSON.stringify(newCodes));
  };

  useEffect(() => {
    const stored = localStorage.getItem("classCodes");
    const parsed = stored !== null ? JSON.parse(stored) : null;

    Notification.requestPermission();

    if (parsed) {
      setWatched(parsed);
    }
  }, []);

  useEffect(() => {
    if (isRefetching) notifiedRef.current = false;
  }, [isRefetching]);

  useEffect(() => {
    if (data !== undefined) {
      console.log(data.codes[0]?.status);
      localStorage.setItem("classCodes", JSON.stringify(data.codes));

      if (!notifiedRef.current && data.sendNotif) {
        notifiedRef.current = true;
        tellServer("[USE EFFECT] SendNotif is True, sending Notification!");
        console.log(data.timestamp?.getTime());

        new Notification("Course/s changed status.", {
          body: "One of your watched courses either opened or close, check it out!",
        });
      }

      setWatched(data.codes);
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
          {watched.length !== 0 ? (
            watched.map((code) => (
              <WatchItem key={code.code} code={code} removeItem={removeClass} />
            ))
          ) : (
            <span className="text-gray-500 italic">
              No class codes added yet...
            </span>
          )}
        </CardContent>
        <CardFooter className="text-gray-500 text-sm mt-auto">{`Last Updated: ${new Date(
          dataUpdatedAt
        ).toLocaleTimeString()}`}</CardFooter>
      </Card>
    </div>
  );
};

export default CourseList;
