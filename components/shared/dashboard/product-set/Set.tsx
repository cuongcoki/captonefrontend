"use client";
import { CardTitle, Card } from "@/components/ui/card";
import RenderTableSet from "./table/sets/RenderTable";

export default function SetPage() {
  return (
    <div className="!mb-15">
      {/* <Card> */}
        <RenderTableSet />
      {/* </Card> */}
    </div>
  );
}