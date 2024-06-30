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
          <div className="p-3 text-2xl text-primary-backgroudPrimary font-medium">
            NHÂN VIÊN
          </div>
        </CardTitle>
        <RenderTableUsers searchParams={searchParams} />
      </div>
    </Card>
  );
}
