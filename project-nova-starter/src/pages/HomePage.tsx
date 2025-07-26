import PostCard from '@/components/feed/PostCard';
import { useGetPosts } from '@/hooks/usePosts';
import { Loader2, Zap, Trophy, Megaphone, Info, CheckCircle, Clock } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreatePostModal } from '@/components/feed/CreatePostModal';
import { useState } from 'react';
import { Progress } from "@/components/ui/progress"


// --- NEW MODULES FOR THE LAUNCHPAD ---

const YourProgressModule = () => {
    const { user } = useAuthStore();
    return (
        <Card className="sticky top-20 aurora-module-bg border-primary/20 shadow-lg">
            <CardHeader className='pb-4'>
                <div className='flex items-center gap-2'>
                    <Trophy className='w-5 h-5 text-primary'/>
                    <CardTitle className="text-lg">Your Progress</CardTitle>
                </div>
                <CardDescription>Milestones on your Nova journey.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 text-sm'>
                    <div>
                        <div className='flex justify-between mb-1'>
                            <p>Profile Completion</p>
                            <p className='font-semibold'>75%</p>
                        </div>
                        <Progress value={75} className="h-2"/>
                    </div>
                     <div>
                        <div className='flex justify-between mb-1'>
                            <p>GKE & Anthos Skill Path</p>
                            <p className='font-semibold'>4/10 Modules</p>
                        </div>
                        <Progress value={40} className="h-2"/>
                    </div>
                    <Button variant="outline" className='w-full mt-2'>View All Achievements</Button>
                </div>
            </CardContent>
        </Card>
    );
};

const NovaInfoModule = () => {
    return (
        <Card className="sticky top-[22rem]">
            <CardHeader className='pb-4'>
                <div className='flex items-center gap-2'>
                    <Info className='w-5 h-5 text-primary'/>
                    <CardTitle className="text-lg">About Nova</CardTitle>
                </div>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground space-y-3'>
                <p>Nova is an initiative to explore and master Google Cloud by building real-world applications and sharing our collective expertise.</p>
                <Button variant="secondary" className='w-full'>Learn More</Button>
            </CardContent>
        </Card>
    );
}

const NovaNewsModule = () => {
    return (
        <Card className="sticky top-20 aurora-module-bg border-primary/20 shadow-lg">
             <CardHeader className='pb-4'>
                <div className='flex items-center gap-2'>
                    <Megaphone className='w-5 h-5 text-primary'/>
                    <CardTitle className="text-lg">News & Updates</CardTitle>
                </div>
            </CardHeader>
             <CardContent className="text-sm space-y-4">
                <div className='group cursor-pointer'>
                    <p className='font-semibold group-hover:text-primary'>New Feature: Project Showcases</p>
                    <p className='text-xs text-muted-foreground'>Announcing a dedicated space to...</p>
                </div>
                 <div className='group cursor-pointer'>
                    <p className='font-semibold group-hover:text-primary'>Community Spotlight: Dhiraj's Cost...</p>
                    <p className='text-xs text-muted-foreground'>An innovative use of Cloud Storage...</p>
                </div>
            </CardContent>
        </Card>
    );
};


// --- THE NEW HOMEPAGE ORCHESTRATOR ---
const HomePage = () => {
    const { data: posts, isLoading } = useGetPosts();
    const [isCreatePostOpen, setCreatePostOpen] = useState(false);

    // Filter posts for the user to see their pending/approved items
    // In a real app, this would be a separate API call.
    const myPosts = posts?.filter(p => p.authorId === useAuthStore.getState().user?.id);

    return (
        <>
            <CreatePostModal isOpen={isCreatePostOpen} onOpenChange={setCreatePostOpen} />

            <div className="w-full max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
                
                {/* Left Column */}
                <aside className="hidden lg:block lg:col-span-3">
                    <YourProgressModule />
                    <div className='mt-8'><NovaInfoModule /></div>
                </aside>

                {/* Center Column: The Pulse */}
                <main className="col-span-12 lg:col-span-6">
                    {/* Create Post Trigger */}
                    <Card className="mb-6 shadow-md hover:shadow-primary/20 transition-shadow">
                        <CardContent className="p-3 flex items-center gap-4">
                            <Avatar><AvatarImage src={useAuthStore.getState().user?.pictureUrl || ''} /><AvatarFallback>U</AvatarFallback></Avatar>
                            <Button onClick={() => setCreatePostOpen(true)} variant="outline" className="w-full justify-start h-12 text-left rounded-full text-muted-foreground">
                                <Zap className='w-4 h-4 mr-2 text-primary'/> What innovation will you share today?
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Pending Posts Notification */}
                    <Card className='mb-6 border-l-4 border-amber-500'>
                        <CardHeader className='flex-row items-center gap-4 p-4'>
                            <Clock className='w-6 h-6 text-amber-500'/>
                            <div>
                                <CardTitle className='text-md'>Your Pending Posts</CardTitle>
                                <CardDescription className='text-xs'>These posts are awaiting admin approval.</CardDescription>
                            </div>
                        </CardHeader>
                        {/* List pending posts here... */}
                    </Card>

                    {/* The Feed Itself */}
                    {isLoading && <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary"/></div>}
                    <div className="space-y-6">
                        {posts?.filter(p => p.approved).map(post => <PostCard key={post.id} post={post} />)}
                    </div>
                </main>

                {/* Right Column */}
                <aside className="hidden lg:block lg:col-span-3">
                    <NovaNewsModule />
                </aside>
            </div>
        </>
    );
};

export default HomePage;