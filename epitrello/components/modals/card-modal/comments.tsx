"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetcher } from "@/lib/fetcher";

export function Comments({ cardId }: { cardId: string }) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const { data: comments, isLoading } = useQuery({
    queryKey: ["card-comments", cardId],
    queryFn: () => fetcher(`/api/cards/${cardId}/comments`),
    enabled: !!cardId,
  });

  const mutation = useMutation({
    mutationFn: async (newContent: string) => {
      return fetcher(`/api/cards/${cardId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: newContent }),
    });
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["card-comments", cardId] });
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Commentaires</h3>
      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        <ul className="space-y-2">
          {comments?.map((c: any) => (
            <li key={c.id} className="border rounded p-2">
              <div className="text-sm font-bold">{c.user?.name || c.user?.email}</div>
              <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
              <div>{c.content}</div>
            </li>
          ))}
        </ul>
      )}
      <form
        onSubmit={e => {
          e.preventDefault();
          if (content.trim()) mutation.mutate(content);
        }}
        className="flex gap-2"
      >
        <input
          className="flex-1 border rounded px-2 py-1"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Ajouter un commentaire..."
          maxLength={1000}
        />
        <button type="submit" className="bg-primary text-white px-4 py-1 rounded hover:opacity-90 disabled:opacity-50" disabled={mutation.isPending}>
          Envoyer
        </button>
      </form>
    </div>
  );
}
