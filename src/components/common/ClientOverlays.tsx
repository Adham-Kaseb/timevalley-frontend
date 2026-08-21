"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/common/CustomCursor"), { ssr: false });
const CustomContextMenu = dynamic(() => import("@/components/common/CustomContextMenu"), { ssr: false });
const TimeValleyAssistant = dynamic(() => import("@/components/assistant/TimeValleyAssistant"), { ssr: false });

export default function ClientOverlays() {
  return (
    <>
      <CustomCursor />
      <CustomContextMenu />
      <TimeValleyAssistant />
    </>
  );
}
