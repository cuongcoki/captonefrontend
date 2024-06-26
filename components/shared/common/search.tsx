import { attendanceApi } from "@/apis/attendance.api";
import { Input } from "@/components/ui/input";
import { GetAllProductResponse } from "@/types/attendance.type";
import { set } from "date-fns";
import React, { useEffect, useState } from "react";

type SearchAndChoseProps = {
  searchInput: string;
  searchData: GetAllProductResponse | null;
  setSearchInput: (value: string) => void;
};
export default function SearchAndChose({
  searchInput,
  searchData,
  setSearchInput,
}: SearchAndChoseProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div style={{ position: "relative", width: "300px" }}>
      <Input
        value={searchInput}
        onChange={handleInputChange}
        placeholder="Search..."
      />
      {searchData && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {searchData.data.data.map((item) => (
            <li
              key={item.id}
              style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                console.log("Chose item: ", item);
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
      {searchInput !== "" && !searchData && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            zIndex: 1000,
            padding: "8px",
          }}
        >
          No data found
        </div>
      )}
    </div>
  );
}
