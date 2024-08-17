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
    <Card className="flex flex-row">
      <CardHeader className="justify-center">
        <CardTitle>Watch a class code</CardTitle>
        <CardDescription>
          Enter the course code and class code to watch
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form action={handleForm}>
          <div className="flex flex-row gap-4 items-end h-full">
            <div>
              <Label htmlFor="course" className="text-nowrap">
                Course Code
              </Label>
              <Input
                id="course"
                name="course"
                type="text"
                placeholder="GEXXXXX"
              />
            </div>
            <div>
              <Label htmlFor="code" className="text-nowrap">
                Class Code
              </Label>
              <Input id="code" name="code" type="text" placeholder="123" />
            </div>
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
