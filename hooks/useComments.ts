'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Comment {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromDB(row: any): Comment {
  return {
    id: row.id,
    listingId: row.listing_id,
    userId: row.user_id,
    userName: row.user_name,
    text: row.text,
    createdAt: row.created_at,
  };
}

export function useComments(listingId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('comments')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('useComments fetch error:', error);
        setComments((data ?? []).map(fromDB));
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  const addComment = useCallback(async (userId: string, userName: string, text: string) => {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        listing_id: listingId,
        user_id: userId,
        user_name: userName,
        text: text.trim(),
      })
      .select()
      .single();
    if (error) { console.error('useComments addComment error:', error); return; }
    setComments((prev) => [fromDB(data), ...prev]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  const deleteComment = useCallback(async (commentId: string) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    if (error) { console.error('useComments deleteComment error:', error); return; }
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { comments, addComment, deleteComment };
}
