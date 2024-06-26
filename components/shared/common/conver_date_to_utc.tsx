import React from "react";

export default function ConvertDateToUtc(dateString: string) {
  const date = new Date(dateString);
  let utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return utcDate;
}
