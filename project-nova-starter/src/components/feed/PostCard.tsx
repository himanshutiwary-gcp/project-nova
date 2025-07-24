import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp, Star, Share2 } from "lucide-react";
import { useToggleLike, PostType } from "@/hooks/usePosts";

interface PostCardProps {
    post: PostType;
}

const PostCard = ({ post }: PostCardProps) => {
    const toggleLikeMutation = useToggleLike();

    const handleLikeClick = () => {
        toggleLikeMutation.mutate(post.id);
    }

    const formatTimestamp = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    return (
        <Card className="w-full max-w-2xl mx-auto mb-6">
            <CardHeader>
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src={post.author.pictureUrl || ''} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-foreground">{post.author.name}</p>
                        <p className="text-sm text-muted-foreground">{post.author.title || 'Innovator'} • {formatTimestamp(post.createdAt)}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-foreground/90 whitespace-pre-wrap">{post.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between p-2 border-t">
                 <Button 
                    variant="ghost" 
                    className={`flex-1 ${post.likedByMe ? 'text-primary' : 'text-muted-foreground'}`}
                    onClick={handleLikeClick}
                    >
                    <ThumbsUp className="w-5 h-5 mr-2" /> Like ({post._count.likes})
                </Button>
                <Button variant="ghost" className="flex-1 text-muted-foreground">
                    <MessageCircle className="w-5 h-5 mr-2" /> Comment
                </Button>
                <Button variant="ghost" className="flex-1 text-muted-foreground">
                    <Star className="w-5 h-5 mr-2" /> Save
                </Button>
                <Button variant="ghost" className="flex-1 text-muted-foreground">
                    <Share2 className="w-5 h-5 mr-2" /> Share
                </Button>
            </CardFooter>
        </Card>
    );
};

export default PostCard;
