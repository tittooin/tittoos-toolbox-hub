import DealsLayout from "../components/DealsLayout";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft } from "lucide-react";

const ArticleDetails = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <DealsLayout title="Article Engine Review" subtitle={`Dynamic editorial content for article key: ${id}`}>
      <Card className="border-primary/10">
        <CardHeader>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Link to="/deals" className="flex items-center gap-1 hover:text-primary no-underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Catalog
            </Link>
            <span>/</span>
            <span>Article Review</span>
          </div>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Article Review Details Placeholder
          </CardTitle>
          <CardDescription>
            Seamless SEO-rich content target integration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Aapne dynamic article detail route select kiya hai. Path unique key identifier: <code className="bg-muted px-1.5 py-0.5 rounded text-primary text-xs">{id}</code>.
          </p>
          <p className="text-xs text-muted-foreground">
            Future phase updates me, is section par complete AI article editor outputs, rich image visualizations, and embedded target comparisons cards live load honge.
          </p>
        </CardContent>
      </Card>
    </DealsLayout>
  );
};

export default ArticleDetails;
