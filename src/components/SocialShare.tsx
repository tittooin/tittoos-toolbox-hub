import { Facebook, Twitter, Linkedin, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SocialShareProps {
    url: string;
    title: string;
    description?: string;
}

const SocialShare = ({ url, title, description }: SocialShareProps) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description || "");

    const shareLinks = [
        {
            name: "Facebook",
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: "hover:bg-[#1877F2] hover:text-white",
        },
        {
            name: "Twitter",
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            color: "hover:bg-[#1DA1F2] hover:text-white",
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: "hover:bg-[#0A66C2] hover:text-white",
        },
        {
            name: "WhatsApp",
            icon: MessageCircle,
            url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
            color: "hover:bg-[#25D366] hover:text-white",
        },
        {
            name: "Pinterest",
            icon: Share2,
            url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedDesc}&media=https://axevora.com/placeholder.svg`,
            color: "hover:bg-[#BD081C] hover:text-white",
        },
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="flex flex-col space-y-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share this tool
                </h3>
                <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 text-xs">
                    Copy Link
                </Button>
            </div>
            <div className="flex gap-2">
                {shareLinks.map((platform) => (
                    <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 transition-all duration-200 ${platform.color} shadow-sm hover:shadow-md`}
                        aria-label={`Share on ${platform.name}`}
                    >
                        <platform.icon className="h-5 w-5" />
                    </a>
                ))}
            </div>
        </div>
    );
};

export default SocialShare;
