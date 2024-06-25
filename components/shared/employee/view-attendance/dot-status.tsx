import React from "react";

type Props = {
  variant: "green" | "gray" | "blue" | "orange" | "yellow";
  className?: string;
};

export default function DotStatus({ variant, className }: Props) {
  const colorStore = {
    green: "bg-green-400",
    blue: "bg-blue-400",
    orange: "bg-orange-400",
    yellow: "bg-yellow-400",
    gray: "bg-gray-400",
  };
  return (
    <div
      className={`rounded-full size-2 xl:size-3 ${className} ${colorStore[variant]}`}
    ></div>
  );
}
