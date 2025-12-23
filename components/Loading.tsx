import Loadinggif from "@/public/images/loading.gif";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="w-full h-screen bg-[#F9FAFB] center flex-col gap-5">
      <Image src={Loadinggif} alt="loading" className="w-[100px] h-[100px]"/>
      <p className="text-[32px] font-medium text-[#4A8AEE]">로딩중...</p>
    </div>
  )
}