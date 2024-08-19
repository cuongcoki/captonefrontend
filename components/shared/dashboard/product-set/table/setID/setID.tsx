"use client";

import Image from "next/image";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// ** import UI
import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ** import api
import { setApi } from "@/apis/set.api";
// ** import icon
// ** component
import SetProduct from "./setProduct";
import { SetUpdateForm } from "../../form/SetUpdateForm";
import { filesApi } from "@/apis/files.api";
import { PencilLine } from "lucide-react";
import { ProductSetStore } from "@/components/shared/dashboard/product-set/product-set-store";
import HeaderComponent from "@/components/shared/common/header";

export default function SetIDPage() {
  //state
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  const [setId, setSetId] = useState<any>([]);
  const [setProduct, setSetProduct] = useState<any>([]);
  const [linkImg, setLinkImg] = useState<string>("");
  const { force } = ProductSetStore();
  useEffect(() => {
    const fetchDataProductId = async () => {
      setLoading(true);
      try {
        const res = await setApi.getSetId(params.id);
        const userData = res.data.data;
        setSetId(userData);
        setSetProduct(userData.setProducts);
        const { data } = await filesApi.getFile(userData.imageUrl);
        setLinkImg(data.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDataProductId();
    // console.log("RELOAD");
  }, [params.id, force]);

  return (
    <>
      <HeaderComponent
        title="Chi tiết bộ sản phẩm"
        description="Thông tin chi tiết của bộ sản phẩm"
      />
      <div className="flex flex-col gap-6 justify-center">
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-primary">Thông tin</CardTitle>
                    <span className="text-xs font-normal leading-snug text-muted-foreground">
                      Thông tin cơ bản của bộ sản phẩm.
                    </span>
                  </div>
                  <div className="rounded p-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <SetUpdateForm setId={setId.id}>
                      <PencilLine />
                    </SetUpdateForm>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Mã bộ sản phẩm</Label>
                    <div className="border p-2 rounded-md border-gray-100">
                      {setId?.code}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="name">Tên bộ sản phẩm</Label>
                    <div className="border p-2 rounded-md border-gray-100">
                      {setId?.name}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Miêu tả</Label>
                    <div className="border p-2 rounded-md border-gray-100">
                      {setId?.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <SetProduct setProduct={setProduct} />
          </div>

          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
              <CardHeader>
                <CardTitle className="text-primary">Hình ảnh</CardTitle>
                <span className="text-xs font-normal leading-snug text-muted-foreground">
                  Hình ảnh minh họa của bộ sản phẩm.
                </span>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {!loading ? (
                    <Image
                      alt="Product image"
                      className="aspect-square w-full rounded-md object-contain"
                      height={900}
                      src={linkImg}
                      width={900}
                    />
                  ) : (
                    <div className="text-center flex flex-col justify-center items-center w-full ">
                      <span className="loading loading-spinner loading-lg text-primary "></span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
