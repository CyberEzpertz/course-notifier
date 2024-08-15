"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Plus, PlusCircle } from "lucide-react";

type Props = {
  addClass: (courseCode: string, classCode: string) => void;
};

const CourseInput = ({ addClass }: Props) => {
  const handleForm = (formData: FormData) => {
    const course = formData.get("course") as string;
    const classCode = formData.get("code") as string;

    addClass(course, classCode);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Watch a class code</CardTitle>
        <CardDescription>
          Enter the course code and class code to watch
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleForm}>
          <div className=" flex flex-col gap-2">
            <Label htmlFor="course">Course Code</Label>
            <Input
              id="course"
              name="course"
              type="text"
              placeholder="GEXXXXX"
            />
            <Label htmlFor="code">Class Code</Label>
            <Input id="code" name="code" type="text" placeholder="123" />
            <Button type="submit" className="gap-2">
              <Plus size={16} /> Add to watchlist
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CourseInput;
