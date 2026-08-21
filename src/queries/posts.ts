import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAskPost } from "@/api/posts";
import { readLocalImage, type LocalImage } from "@/lib/media/read-local-image";
import { queryKeys } from "@/lib/query/query-keys";

export type CreateAskPostMutationInput = {
  authorId: string;
  body?: string;
  images: LocalImage[];
  title: string;
};

export function useCreateAskPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAskPostMutationInput) => {
      const images = await Promise.all(input.images.map(readLocalImage));

      return createAskPost({ ...input, images });
    },
    onSuccess: (post) => {
      queryClient.setQueryData(queryKeys.posts.byId(post.id), post);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.posts.byAuthor(post.author_id),
      });
    },
  });
}
