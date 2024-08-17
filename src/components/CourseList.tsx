"use client";

import { classEntry } from "@/lib/types";
import { fetchCourses } from "@/server-actions/fetch-courses";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CourseInput from "./CourseInput";
import WatchItem from "./WatchItem";
import addNotification, { Notifications } from "react-push-notification";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const CourseList = () => {
  const [codes, setCodes] = useState<classEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const addClass = (courseCode: string, classCode: string) => {
    const code = Number(classCode);
    const exists = codes.filter((existing) => existing.code === code);

    if (exists.length > 0) return;

    const newCodes = [
      ...codes,
      { code: code, course: courseCode.toUpperCase() },
    ];

    setCodes(newCodes);
    localStorage.setItem("classCodes", JSON.stringify(newCodes));
  };

  const removeClass = (classCode: number) => {
    const newCodes = codes.filter((code) => code.code !== classCode);
    console.log(newCodes);

    setCodes(newCodes);
    localStorage.setItem("classCodes", JSON.stringify(newCodes));
  };

  useEffect(() => {
    const stored = localStorage.getItem("classCodes");
    const parsed = stored !== null ? JSON.parse(stored) : null;

    if (parsed) {
      setCodes(parsed);
    }
  }, []);

  const { data } = useQuery({
    queryKey: ["fetch-codes", codes],
    queryFn: async () => {
      setLastUpdated(new Date());
      return await fetchCourses(codes);
    },
    refetchInterval: 1 * 60000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    console.log(`USEEFFECT: ${data?.sendNotif}`);
    if (data !== undefined) {
      setCodes(data.codes);

      if (data.sendNotif) {
        addNotification({
          title: "Class Status Updated",
          message: "One or more of your watched classes' status got updated",
          native: true,
        });
      }
    }
  }, [data]);

  return (
    <div className="flex flex-row w-full min-h-full items-center justify-center gap-4">
      <Notifications />
      <CourseInput addClass={addClass} />
      <Card>
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
          <CardDescription>
            {"Classes that you're currently watching are here"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {codes.length !== 0 ? (
            codes.map((code) => (
              <WatchItem key={code.code} code={code} removeItem={removeClass} />
            ))
          ) : (
            <span className="text-gray-500 italic">
              No class codes added yet...
            </span>
          )}
        </CardContent>
        <CardFooter className="text-gray-500 text-sm">{`Last Updated: ${lastUpdated.toLocaleTimeString()}`}</CardFooter>
      </Card>
    </div>
  );
};

export default CourseList;
