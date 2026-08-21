"use client";

import { useRef, useCallback } from "react";
import apiClient from "@/lib/axios";

interface UseVideoProgressOptions {
  lessonId?: string;
  isLoggedIn: boolean;
  onAutoCompleted?: (lessonId: string) => void;
  syncIntervalMs?: number; // default 10000 ms (10 seconds)
}

export function useVideoProgress({
  lessonId,
  isLoggedIn,
  onAutoCompleted,
  syncIntervalMs = 10000,
}: UseVideoProgressOptions) {
  const lastSyncTimeRef = useRef<number>(0);
  const maxWatchedSecondsRef = useRef<number>(0);
  const hasTriggeredCompleteRef = useRef<boolean>(false);
  const currentLessonIdRef = useRef<string | undefined>(lessonId);

  // If lesson changes, reset tracking
  if (currentLessonIdRef.current !== lessonId) {
    currentLessonIdRef.current = lessonId;
    lastSyncTimeRef.current = 0;
    maxWatchedSecondsRef.current = 0;
    hasTriggeredCompleteRef.current = false;
  }

  const syncProgressToBackend = useCallback(
    async (seconds: number, isCompleted: boolean) => {
      if (!lessonId || !isLoggedIn) return;
      try {
        await apiClient.post("/courses/diploma/progress", {
          lessonId,
          watchDurationSec: Math.floor(seconds),
          isCompleted,
        });
      } catch (err) {
        console.warn("[VideoProgress] Failed to sync progress to backend:", err);
      }
    },
    [lessonId, isLoggedIn]
  );

  const handleTimeUpdate = useCallback(
    (currentTime: number, duration: number) => {
      if (!lessonId || !duration || duration <= 0) return;

      if (currentTime > maxWatchedSecondsRef.current) {
        maxWatchedSecondsRef.current = currentTime;
      }

      // Check for completion threshold (90% watched or within last 15s)
      const percentWatched = (currentTime / duration) * 100;
      const isNearEnd = duration - currentTime <= 15;
      const isCompleted = percentWatched >= 90 || isNearEnd;

      if (isCompleted && !hasTriggeredCompleteRef.current) {
        hasTriggeredCompleteRef.current = true;
        if (onAutoCompleted) {
          onAutoCompleted(lessonId);
        }
        syncProgressToBackend(currentTime, true);
        return;
      }

      // Throttled regular progress sync
      const now = Date.now();
      if (now - lastSyncTimeRef.current >= syncIntervalMs) {
        lastSyncTimeRef.current = now;
        syncProgressToBackend(currentTime, false);
      }
    },
    [lessonId, syncIntervalMs, onAutoCompleted, syncProgressToBackend]
  );

  const handleManualComplete = useCallback(
    (
      targetLessonIdOrCompleted?: string | boolean,
      isCompleted?: boolean,
      durationSec?: number
    ) => {
      const targetId =
        typeof targetLessonIdOrCompleted === "string"
          ? targetLessonIdOrCompleted
          : lessonId;
      const completed =
        typeof targetLessonIdOrCompleted === "boolean"
          ? targetLessonIdOrCompleted
          : typeof isCompleted === "boolean"
          ? isCompleted
          : true;
      const seconds =
        durationSec !== undefined ? durationSec : maxWatchedSecondsRef.current;

      if (!targetId || !isLoggedIn) return;
      hasTriggeredCompleteRef.current = completed;
      apiClient
        .post("/courses/diploma/progress", {
          lessonId: targetId,
          watchDurationSec: Math.floor(seconds),
          isCompleted: completed,
        })
        .catch((err) => {
          console.warn("[VideoProgress] Failed to sync manual completion:", err);
        });
    },
    [lessonId, isLoggedIn]
  );

  return {
    handleTimeUpdate,
    handleManualComplete,
    syncProgressToBackend,
  };
}
