"use client";

import * as React from "react";
import { Notifications } from "react-push-notification";

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Notifications />
      {children}
    </>
  );
}
