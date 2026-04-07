import { useMemo } from "react";

export function useVaccineStatus(vaccine: any) {
  return useMemo(() => {
    const now = new Date();

    if (!vaccine?.applications?.length) {
      return {
        status: "urgent",
        daysLeft: 0,
        lastApplied: null,
        nextDueDate: null,
      };
    }

    const latest = [...vaccine.applications].sort(
      (a, b) =>
        new Date(b.dateApplied).getTime() -
        new Date(a.dateApplied).getTime()
    )[0];

    const lastApplied = new Date(latest.dateApplied);

    const nextDueDate = new Date(lastApplied);
    nextDueDate.setDate(nextDueDate.getDate() + vaccine.durationDays);

    const daysUntilDue = Math.ceil(
      (nextDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const daysLeft = Math.max(daysUntilDue, 0);

    let status: "urgent" | "upcoming" | "completed";
    if (daysUntilDue < 0) status = "urgent";
    else if (daysUntilDue <= 7) status = "upcoming";
    else status = "completed";

    return { status, daysLeft, lastApplied, nextDueDate };
  }, [vaccine]);
}