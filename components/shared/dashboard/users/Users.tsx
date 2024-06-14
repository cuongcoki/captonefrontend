import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import RenderTableUsers from "./table/users/RenderTable";
import { CardContent } from "../home/DashbroadComponents/Cards/Card";
import { UserSearchParams } from "@/types/userTypes";

type Props = {
  searchParams: UserSearchParams;
};

export default function UsersPage({ searchParams }: Props) {
  return (
    <Card>
      <div className="!mb-15">
        <CardTitle>
          <h1 className="p-3 text-2xl text-primary-backgroudPrimary font-medium">
            NGƯỜI DÙNG
          </h1>
        </CardTitle>
        <RenderTableUsers searchParams={searchParams} />
      </div>
    </Card>
  );
}
