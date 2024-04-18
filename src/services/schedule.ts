import { schedules } from "@/mock/data";

function isStoreOpen() {
  const date = new Date();
  const day = date.getDay();
  const hour = date.getHours();
  const minutes = date.getMinutes();

  const today = schedules.find((schedule) => schedule.day === day);

  if (!today) return false;
  return minutes
//   if (today.open > hour && today.close ) return true;

  return gg;
}

export { isStoreOpen };
