export type classEntry = {
  status?: "open" | "close";
  details?: Class;
};

export type watchEntry = {
  code: number;
  course: string;
};

export type Modality =
  | "HYBRID"
  | "F2F"
  | "ONLINE"
  | "PREDOMINANTLY_ONLINE"
  | "PREDOMINANTLY_F2F"
  | "PURE_ASYNCHRONOUS"
  | "TENTATIVE";

export type Restriction = "NONE" | "FROSH" | "RESTRICTED";

export type Schedule = {
  day: string;
  start: number;
  end: number;
  isOnline: Boolean;
};

export type Class = {
  code: number;
  course: string;
  section: string;
  professor?: string;
  schedules: Schedule[];
  enrolled: number;
  enrollCap: number;
  room: string;
  restriction: string;
  modality: Modality;
};
