"use client";

import { Class, Code } from "@/lib/types";
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
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

const sampleCodes = [
  {
    code: 3900,
    course: "CSARCH2",
  },
  {
    code: 1740,
    course: "DIGIMAP",
  },
];

const CourseList = () => {
  const [codes, setCodes] = useState<Code[]>(sampleCodes);

  const addClass = (courseCode: string, classCode: string) => {
    const code = Number(classCode);
    const newCodes = [...codes, { code: code, course: courseCode }];

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

  const { data, isLoading } = useQuery({
    queryKey: ["fetch-codes", codes],
    queryFn: async () => await fetchCourses(codes),
    // refetchInterval: 300000,
  });

  useEffect(() => {
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
          {codes.map((code) => (
            <WatchItem key={code.code} code={code} removeItem={removeClass} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseList;
