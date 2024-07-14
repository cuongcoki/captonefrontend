import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import RenderTableUsers from "./table/users/RenderTable";
import { CardContent } from "../home/DashbroadComponents/Cards/Card";
import { UserSearchParams } from "@/types/userTypes";

type Props = {
  searchParams: UserSearchParams;
};

export default function UsersPage({ searchParams }: Props) {
  return (
    <div className="!mb-15">
      
      {/* <Card> */}
        <RenderTableUsers searchParams={searchParams} />
      {/* </Card> */}
    </div>
  );
}