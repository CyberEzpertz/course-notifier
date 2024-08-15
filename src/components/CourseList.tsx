"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type Code = {
  code: number;
  course: string;
  enlisted: number;
  cap: number;
};

const CourseList = () => {
  const [codes, setCodes] = useState<Code[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("courseCodes");
    const parsed = stored !== null ? JSON.parse(stored) : null;

    if (parsed) {
      setCodes(parsed);
    }
  }, []);

  const { data: codeData, isLoading } = useQuery({
    queryKey: ["fetch-codes"],
    queryFn: () => {},
  });

  return <div>Hello World!</div>;
};

export default CourseList;
