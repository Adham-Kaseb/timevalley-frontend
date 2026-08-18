"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/common/CustomCursor"), { ssr: false });
const CustomContextMenu = dynamic(() => import("@/components/common/CustomContextMenu"), { ssr: false });

export default function ClientOverlays() {
  return (
    <>
      <CustomCursor />
      <CustomContextMenu />
    </>
  );
}
