import PostCard from '@/components/feed/PostCard'; // We will create this fully next
import { useGetPosts } from '@/hooks/usePosts'; // Our custom hook for fetching data
import { Loader2, PlusCircle } from 'lucide-react';

// --- THE MISSING IMPORTS ARE HERE ---
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from '@/stores/auth.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// ------------------------------------

const HomePage = () => {
    // Get user data to display their avatar in the "Create Post" section
    const { user } = useAuthStore();
    const { data: posts, isLoading, isError } = useGetPosts();

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-primary"/></div>;
    }
    
    if (isError) {
        return <div className="text-center text-red-500">Failed to load feed. Your backend might be down. Please refresh the page.</div>;
    }

    return (
        <div className="w-full">
            {/* Create Post Section */}
            <div className="max-w-2xl mx-auto mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={user?.pictureUrl || ''} alt={user?.name} />
                                <AvatarFallback>{user?.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <Button className="w-full justify-start h-12 text-left rounded-full" variant="secondary">
                                <PlusCircle className="mr-2 h-5 w-5 text-primary"/>
                                <span className="text-muted-foreground">Share an article, project, or idea...</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* The Feed */}
            {posts && posts.length > 0 ? (
                 posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))
            ) : (
                <div className="text-center text-gray-500 mt-10">
                    <p>The feed is empty.</p>
                    <p className="mt-2 text-sm">Be the first to share an innovation!</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;