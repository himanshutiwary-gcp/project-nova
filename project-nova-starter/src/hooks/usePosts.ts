import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

// Define the type for a Post, matching our backend response
// You can even share types between frontend and backend in a monorepo!
export interface PostType {
    id: string;
    content: string;
    createdAt: string;
    author: { id: string; name: string; pictureUrl: string | null; title: string | null; }; // Author now includes an ID
    authorId: string; // The API now sends this directly too
    approved: boolean; // The new approval field
    _count: { likes: number };
    likedByMe: boolean;
}

// Hook to fetch the main feed
export const useGetPosts = () => {
    return useQuery<PostType[], Error>({
        queryKey: ['posts'],
        queryFn: async () => {
            const { data } = await api.get('/posts');
            return data;
        },
    });
};

// Hook to create a new post
export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newPost: { content: string }) => api.post('/posts', newPost),
        onSuccess: () => {
            // When a post is created, invalidate the 'posts' query to refetch the feed
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success("Your post has been shared!");
        },
        onError: () => {
            toast.error("Something went wrong. Please try again.");
        }
    });
};

// Hook to like a post with OPTIMISTIC UPDATE
export const useToggleLike = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId: string) => api.post(`/posts/${postId}/like`),
        onMutate: async (postId: string) => {
            // Cancel any outgoing refetches to prevent overwriting our optimistic update
            await queryClient.cancelQueries({ queryKey: ['posts'] });

            // Snapshot the previous value
            const previousPosts = queryClient.getQueryData<PostType[]>(['posts']);

            // Optimistically update to the new value
            queryClient.setQueryData<PostType[]>(['posts'], (old) =>
                old?.map(post => {
                    if (post.id === postId) {
                        return {
                           ...post,
                           likedByMe: !post.likedByMe,
                           _count: {
                               likes: post.likedByMe ? post._count.likes - 1 : post._count.likes + 1,
                           },
                        };
                    }
                    return post;
                }) ?? []
            );

            // Return a context object with the snapshotted value
            return { previousPosts };
        },
        // If the mutation fails, use the context we returned to roll back
        onError: (_err, _variables, context) => {
            if (context?.previousPosts) {
                queryClient.setQueryData(['posts'], context.previousPosts);
            }
            toast.error("Couldn't like post. Please try again.");
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
};
