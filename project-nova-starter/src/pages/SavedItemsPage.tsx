import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SavedItemsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Saved Items</h1>

      <div className="grid gap-4">
        {/* We will map over saved items here later */}
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon!</CardTitle>
            <CardDescription>
              This page will display all the articles, posts, and projects you've saved for later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default SavedItemsPage;
