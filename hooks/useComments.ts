'use client';
import { useState, useEffect, useCallback } from 'react';

export interface Comment {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

const KEY = 'flatmatefind_comments';

function load(): Comment[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function useComments(listingId: string) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    setComments(load().filter((c) => c.listingId === listingId));
  }, [listingId]);

  const addComment = useCallback((userId: string, userName: string, text: string) => {
    const all = load();
    const next: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      listingId,
      userId,
      userName,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [next, ...all];
    localStorage.setItem(KEY, JSON.stringify(updated));
    setComments(updated.filter((c) => c.listingId === listingId));
  }, [listingId]);

  const deleteComment = useCallback((commentId: string) => {
    const updated = load().filter((c) => c.id !== commentId);
    localStorage.setItem(KEY, JSON.stringify(updated));
    setComments(updated.filter((c) => c.listingId === listingId));
  }, [listingId]);

  return { comments, addComment, deleteComment };
}
