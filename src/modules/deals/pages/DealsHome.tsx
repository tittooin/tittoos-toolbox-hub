import { useState, useEffect } from "react";
import DealsLayout from "../components/DealsLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Sparkles, Search, ExternalLink, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CuelinksService } from "../../commerce/services/CuelinksService";
import { CommerceDiscoveryItem } from "../../commerce/types/commerceDiscovery";

const DealsHome = () => {
  const [deals, setDeals] = useState<CommerceDiscoveryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await CuelinksService.getDeals();
        if (response && response.items) {
          setDeals(response.items);
        }
      } catch (err) {
        console.error("Failed to load deals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`/api/commerce/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.items) {
          setSearchResults(data.items);
        }
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const displayItems = searchResults.length > 0 ? searchResults : deals;

  return (
    <DealsLayout title="Latest Deals Engine" subtitle="Real-time discount catalog tracking system">
      
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products, stores, brands..." 
              className="pl-10 h-12 rounded-xl border-primary/20 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" className="h-12 px-8 rounded-xl" disabled={isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search Deals'}
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {searchResults.length > 0 && (
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> 
                Search Results for "{searchQuery}"
              </h2>
              <Button variant="ghost" onClick={() => {setSearchResults([]); setSearchQuery("");}}>
                Clear Search
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayItems.map((item, idx) => (
              <Card key={item.id || idx} className="overflow-hidden hover:border-primary/40 transition-all flex flex-col">
                {item.bannerImage || item.image ? (
                  <div className="w-full h-48 bg-muted overflow-hidden relative">
                    <img 
                      src={item.bannerImage || item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                    {(item.discountText || item.price) && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        {item.discountText || item.price}
                      </div>
                    )}
                  </div>
                ) : null}
                <CardHeader className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {item.merchantLogo && (
                      <img src={item.merchantLogo} alt={item.merchantName} className="h-5 w-5 rounded-sm object-contain" />
                    )}
                    <span className="text-xs font-medium text-muted-foreground">{item.merchantName || item.source}</span>
                  </div>
                  <CardTitle className="text-lg leading-tight line-clamp-2">{item.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-sm mt-2">
                    {item.description || "Discover amazing deals and discounts today."}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Button asChild className="w-full font-medium" variant="default">
                    <a href={item.trackingUrl || item.url || item.destinationUrl} target="_blank" rel="noopener noreferrer">
                      Grab Deal <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {displayItems.length === 0 && !loading && (
            <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed">
              <Tag className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No Deals Found</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mt-2">
                We couldn't find any deals matching your criteria right now. Try searching for something else.
              </p>
            </div>
          )}
        </>
      )}
    </DealsLayout>
  );
};

export default DealsHome;
