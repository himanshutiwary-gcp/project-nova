import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePost } from "@/hooks/usePosts";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast"; // Import toast

interface CreatePostModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export const CreatePostModal = ({ isOpen, onOpenChange }: CreatePostModalProps) => {
    const [content, setContent] = useState('');
    const createPostMutation = useCreatePost();
    
    const handleSubmit = () => {
        if (!content.trim()) return;
        createPostMutation.mutate({ content }, {
            onSuccess: () => {
                setContent('');
                onOpenChange(false);
                // THE CRUCIAL USER FEEDBACK
                toast.success("Post submitted! It is now pending admin approval.", {
                    icon: '🕒',
                    duration: 5000,
                });
            }
        });
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Share an Innovation</DialogTitle>
                    <DialogDescription>Your post will be visible to the community after admin approval.</DialogDescription>
                </DialogHeader>
                <Textarea placeholder="What's on your mind?" className="min-h-32" value={content} onChange={(e) => setContent(e.target.value)} />
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit} disabled={createPostMutation.isPending || !content.trim()}>
                        {createPostMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit for Approval
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};