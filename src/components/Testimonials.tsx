import { Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const reviews = [
    {
        name: "Rahul Sharma",
        role: "Content Creator",
        content: "Hidden Gem! Best Free Alternative to Paid AI Tools. The 'Tech Battle' feature is a game-changer—it gave me a direct comparison between the iPhone 15 and S24 without reading 10 articles.",
        rating: 5,
        initial: "R"
    },
    {
        name: "Priya Patel",
        role: "Digital Marketer",
        content: "I use the Hashtag Generator daily for my clients. It's fast, free, and actually gives relevant tags. Setup is zero - just open and use. Love it!",
        rating: 5,
        initial: "P"
    },
    {
        name: "Amit Kumar",
        role: "Student",
        content: "The PDF to Word converter saved my assignment submission last night. Text formatting was perfect. Thanks Axevora!",
        rating: 5,
        initial: "A"
    }
];

const Testimonials = () => {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 mb-4">
                        Trusted by Creators & Professionals
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of users who rely on Axevora for their daily productivity and content needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, idx) => (
                        <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-shadow bg-background/60 backdrop-blur">
                            <CardContent className="p-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground mb-6 min-h-[80px]">
                                    "{review.content}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                        {review.initial}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{review.name}</h4>
                                        <p className="text-xs text-muted-foreground">{review.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
