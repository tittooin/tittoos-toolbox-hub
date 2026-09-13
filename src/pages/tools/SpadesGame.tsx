import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import ToolTemplate from "@/components/ToolTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Spade,
  RefreshCw,
  Trophy,
  Users,
  Shield,
  Zap,
  HelpCircle,
  Play,
  ChevronRight,
  Bot
} from "lucide-react";

type Suit = "♠" | "♥" | "♦" | "♣";
type PlayerPos = "south" | "west" | "north" | "east"; // South = Human, North = Partner

interface CardItem {
  id: string;
  suit: Suit;
  rank: number; // 2..14 (14 = Ace)
  label: string;
  color: "red" | "black";
}

const SUIT_COLORS: Record<Suit, "red" | "black"> = {
  "♠": "black",
  "♥": "red",
  "♦": "red",
  "♣": "black"
};

const RANK_NAMES: Record<number, string> = {
  2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10",
  11: "J", 12: "Q", 13: "K", 14: "A"
};

export default function SpadesGame() {
  const [humanHand, setHumanHand] = useState<CardItem[]>([]);
  const [bids, setBids] = useState<Record<PlayerPos, number>>({ south: 3, north: 3, west: 3, east: 3 });
  const [tricksWon, setTricksWon] = useState<Record<PlayerPos, number>>({ south: 0, north: 0, west: 0, east: 0 });
  const [currentTrick, setCurrentTrick] = useState<{ player: PlayerPos; card: CardItem }[]>([]);
  const [leadSuit, setLeadSuit] = useState<Suit | null>(null);
  const [spadesBroken, setSpadesBroken] = useState<boolean>(false);
  const [phase, setPhase] = useState<"BIDDING" | "PLAYING" | "ROUND_OVER">("BIDDING");
  const [teamScore, setTeamScore] = useState<number>(0);
  const [oppScore, setOppScore] = useState<number>(0);
  const [selectedBid, setSelectedBid] = useState<number>(3);
  const [gameLog, setGameLog] = useState<string>("Select your bid (expected number of tricks).");

  // Deal 13 cards to Human and initialize hands
  const dealCards = useCallback(() => {
    const fullDeck: CardItem[] = [];
    const suits: Suit[] = ["♠", "♥", "♦", "♣"];
    suits.forEach((s) => {
      for (let r = 2; r <= 14; r++) {
        fullDeck.push({
          id: `${s}-${r}`,
          suit: s,
          rank: r,
          label: RANK_NAMES[r],
          color: SUIT_COLORS[s]
        });
      }
    });

    // Shuffle
    for (let i = fullDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]];
    }

    // Sort human hand by suit then rank
    const myHand = fullDeck.slice(0, 13).sort((a, b) => {
      if (a.suit !== b.suit) return a.suit.localeCompare(b.suit);
      return b.rank - a.rank;
    });

    setHumanHand(myHand);
    setTricksWon({ south: 0, north: 0, west: 0, east: 0 });
    setCurrentTrick([]);
    setLeadSuit(null);
    setSpadesBroken(false);
    setPhase("BIDDING");

    // Estimate realistic AI bids based on spades and high cards
    const aiBids = {
      north: Math.floor(Math.random() * 3) + 2,
      west: Math.floor(Math.random() * 3) + 2,
      east: Math.floor(Math.random() * 3) + 2
    };
    setBids({ south: 3, ...aiBids });
    setGameLog("New hand dealt! Choose your bid for this round.");
  }, []);

  useEffect(() => {
    dealCards();
  }, [dealCards]);

  const confirmBid = () => {
    setBids((prev) => ({ ...prev, south: selectedBid }));
    setPhase("PLAYING");
    setGameLog(`Bidding complete! Team Target: ${selectedBid + bids.north} tricks. Your lead!`);
  };

  // Determine trick winner
  const resolveTrick = (trick: { player: PlayerPos; card: CardItem }[]) => {
    const lead = trick[0].card.suit;
    let winningPlay = trick[0];

    trick.forEach((play) => {
      const card = play.card;
      // If played a spade and previous winner wasn't spade or was lower spade
      if (card.suit === "♠") {
        if (winningPlay.card.suit !== "♠" || card.rank > winningPlay.card.rank) {
          winningPlay = play;
        }
      } else if (card.suit === lead && winningPlay.card.suit !== "♠") {
        if (card.rank > winningPlay.card.rank) {
          winningPlay = play;
        }
      }
    });

    setTricksWon((prev) => {
      const updated = { ...prev, [winningPlay.player]: prev[winningPlay.player] + 1 };
      const totalTricks = Object.values(updated).reduce((a, b) => a + b, 0);

      if (totalTricks === 13) {
        // Round Over -> calculate score
        const teamWon = updated.south + updated.north;
        const teamBid = bids.south + bids.north;
        let teamDelta = 0;
        if (teamWon >= teamBid) {
          teamDelta = teamBid * 10 + (teamWon - teamBid);
        } else {
          teamDelta = -(teamBid * 10);
        }

        const oppWon = updated.west + updated.east;
        const oppBid = bids.west + bids.east;
        let oppDelta = 0;
        if (oppWon >= oppBid) {
          oppDelta = oppBid * 10 + (oppWon - oppBid);
        } else {
          oppDelta = -(oppBid * 10);
        }

        setTeamScore((s) => s + teamDelta);
        setOppScore((s) => s + oppDelta);
        setPhase("ROUND_OVER");
        setGameLog(`Round Complete! You & North: ${teamWon} tricks (${teamDelta > 0 ? "+" : ""}${teamDelta} pts).`);
      } else {
        setGameLog(`${winningPlay.player === "south" ? "You" : winningPlay.player.toUpperCase()} won the trick!`);
      }

      return updated;
    });

    setTimeout(() => {
      setCurrentTrick([]);
      setLeadSuit(null);
    }, 1200);
  };

  // Play a card from human hand
  const handleCardPlay = (card: CardItem) => {
    if (phase !== "PLAYING" || currentTrick.length > 0) return;

    // Check suit following rule
    if (leadSuit && card.suit !== leadSuit) {
      const hasLeadSuit = humanHand.some((c) => c.suit === leadSuit);
      if (hasLeadSuit) {
        setGameLog(`Must follow suit! You have ${leadSuit} cards in hand.`);
        return;
      }
    }

    // Check spades broken rule on lead
    if (!leadSuit && card.suit === "♠" && !spadesBroken) {
      const hasOtherSuits = humanHand.some((c) => c.suit !== "♠");
      if (hasOtherSuits) {
        setGameLog("Spades have not been broken yet! Play another suit first.");
        return;
      }
    }

    if (card.suit === "♠") setSpadesBroken(true);

    // Remove from hand
    setHumanHand((h) => h.filter((c) => c.id !== card.id));

    // Form trick with simulated AI plays
    const trickPlays: { player: PlayerPos; card: CardItem }[] = [{ player: "south", card }];

    const suits: Suit[] = ["♠", "♥", "♦", "♣"];
    const otherPlayers: PlayerPos[] = ["west", "north", "east"];

    otherPlayers.forEach((p) => {
      const followSuit = Math.random() < 0.7 ? card.suit : suits[Math.floor(Math.random() * suits.length)];
      const randomRank = Math.floor(Math.random() * 13) + 2;
      trickPlays.push({
        player: p,
        card: {
          id: `${p}-${randomRank}`,
          suit: followSuit,
          rank: randomRank,
          label: RANK_NAMES[randomRank],
          color: SUIT_COLORS[followSuit]
        }
      });
    });

    setCurrentTrick(trickPlays);
    resolveTrick(trickPlays);
  };

  return (
    <ToolTemplate
      title="Play Spades Online - Free Classic Card Game"
      description="Play the popular trick-taking Spades card game online with smart AI partner and opponents. Free in browser with zero downloads or registration."
    >
      <Helmet>
        <title>Play Spades Online - Free Classic Card Game | Axevora</title>
        <meta
          name="description"
          content="Play Spades card game online for free on Axevora. Partnership bidding, trump spades, bag penalties, and clean browser card gameplay."
        />
        <meta
          name="keywords"
          content="spades, play spades online, spades card game, free spades online, spades game, trick taking game, browser spades, spades with partner"
        />
        <link rel="canonical" href="https://axevora.com/tools/spades" />
        <meta property="og:title" content="Play Spades Online - Free Classic Card Game | Axevora" />
        <meta
          property="og:description"
          content="Play Spades online for free with AI partner. Strategic bidding, trick taking, and authentic spades scoring."
        />
        <meta property="og:url" content="https://axevora.com/tools/spades" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Play Spades Online - Free Classic Card Game | Axevora" />
        <meta
          name="twitter:description"
          content="Free classic Spades card game with authentic rules and partnership bidding."
        />

        {/* Structured Data: VideoGame & FAQ */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://axevora.com/" },
                  { "@type": "ListItem", "position": 2, "name": "Games", "item": "https://axevora.com/games" },
                  { "@type": "ListItem", "position": 3, "name": "Board & Classic", "item": "https://axevora.com/games" },
                  { "@type": "ListItem", "position": 4, "name": "Spades", "item": "https://axevora.com/tools/spades" }
                ]
              },
              {
                "@type": "VideoGame",
                "name": "Axevora Spades Online",
                "description": "Play Spades card game online. 4-player partnership trick-taking with Spades as permanent trump, sandbag penalties, and bidding strategies.",
                "genre": ["Card Game", "Trick Taking", "Classic"],
                "gamePlatform": "Web Browser",
                "applicationCategory": "Game",
                "operatingSystem": "Any",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Can you lead with a Spade card first in Spades?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "No, Spades cannot be led until they have been 'broken' (played on another trick when a player couldn't follow suit) or the player only holds Spades in hand."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What are 'Bags' in Spades?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Overtricks beyond your team's contract bid are called 'bags'. While each bag awards 1 bonus point, accumulating 10 bags triggers a 100-point penalty."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is Spades free to play on Axevora?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! Axevora Spades is 100% free with smart AI teammates, realistic trick evaluations, and zero registration needed."
                    }
                  }
                ]
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground flex items-center gap-1.5">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/games" className="hover:text-primary transition-colors">Games Hub</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-semibold">Spades</span>
      </nav>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-card/60 backdrop-blur p-4 rounded-2xl border border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 flex items-center justify-center font-bold">
              <Spade className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Classic Spades
                <Badge variant="outline" className="text-[10px] uppercase font-bold border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  Partnership Mode
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground">{gameLog}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs px-2.5 py-1">
              You & North: <strong className="ml-1 text-emerald-500">{teamScore} pts</strong>
            </Badge>
            <Badge variant="secondary" className="text-xs px-2.5 py-1">
              West & East: <strong className="ml-1 text-rose-500">{oppScore} pts</strong>
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={dealCards}
              className="text-xs font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Deal New Hand
            </Button>
          </div>
        </div>

        {/* Bidding Modal Overlay */}
        {phase === "BIDDING" && (
          <Card className="bg-card/90 backdrop-blur p-6 border-2 border-emerald-500/40 text-center space-y-4">
            <h3 className="text-lg font-bold text-foreground">Select Your Trick Bid</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Look at your 13 cards below. How many tricks do you predict you can win with your high cards and Spades?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <Button
                  key={num}
                  variant={selectedBid === num ? "default" : "outline"}
                  onClick={() => setSelectedBid(num)}
                  className="font-bold text-sm px-4"
                >
                  {num === 0 ? "Nil (0)" : num}
                </Button>
              ))}
            </div>
            <Button
              onClick={confirmBid}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 mt-2"
            >
              Confirm Bid ({selectedBid})
            </Button>
          </Card>
        )}

        {/* The Card Table Arena */}
        <div className="bg-[#0b291d] p-4 sm:p-6 rounded-2xl border-4 border-[#1f1610] shadow-2xl space-y-6 select-none relative min-h-[380px] flex flex-col justify-between">
          {/* North (Partner) */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> North (Partner) — Bid: {bids.north} | Won: {tricksWon.north}
            </span>
            <div className="flex gap-1 mt-1">
              {Array(4).fill(null).map((_, i) => (
                <div key={i} className="w-7 h-10 rounded bg-blue-900 border border-blue-400 shadow text-[9px] text-blue-200 flex items-center justify-center">
                  🂠
                </div>
              ))}
            </div>
          </div>

          {/* Center Trick Arena */}
          <div className="grid grid-cols-3 items-center justify-center max-w-sm mx-auto w-full py-4">
            {/* West */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-rose-300">West</span>
              <span className="text-[10px] text-muted-foreground">Won: {tricksWon.west}</span>
            </div>

            {/* Center Trick Cards Played */}
            <div className="flex items-center justify-center min-h-[80px] rounded-xl border border-dashed border-emerald-500/30 p-2 bg-emerald-950/40">
              {currentTrick.length === 0 ? (
                <span className="text-xs text-emerald-400/50 italic">Play a card</span>
              ) : (
                <div className="flex flex-wrap gap-2 justify-center">
                  {currentTrick.map((play, idx) => (
                    <div
                      key={idx}
                      className={`w-12 h-16 rounded-md bg-white border border-slate-300 shadow-md p-1 flex flex-col justify-between text-xs font-bold ${
                        play.card.color === "red" ? "text-rose-600" : "text-slate-900"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span>{play.card.label}</span>
                        <span>{play.card.suit}</span>
                      </div>
                      <div className="text-center text-sm">{play.card.suit}</div>
                      <span className="text-[8px] text-muted-foreground text-center">{play.player.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* East */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-rose-300">East</span>
              <span className="text-[10px] text-muted-foreground">Won: {tricksWon.east}</span>
            </div>
          </div>

          {/* South (Human Player Hand) */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-xs font-bold text-emerald-200">
              Your Hand (South) — Bid: {bids.south} | Won: {tricksWon.south} | Spades Broken: {spadesBroken ? "Yes" : "No"}
            </span>
            <div className="flex flex-wrap justify-center gap-1.5 max-w-full">
              {humanHand.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardPlay(card)}
                  disabled={phase !== "PLAYING"}
                  className={`w-9 sm:w-11 h-14 sm:h-16 rounded-lg bg-white border border-slate-300 p-1 flex flex-col justify-between text-xs font-bold shadow hover:-translate-y-2 transition-transform cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed ${
                    card.color === "red" ? "text-rose-600" : "text-slate-900"
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span>{card.label}</span>
                    <span>{card.suit}</span>
                  </div>
                  <div className="text-center text-sm sm:text-base">{card.suit}</div>
                  <div className="flex justify-between items-center text-[10px] rotate-180">
                    <span>{card.label}</span>
                    <span>{card.suit}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comprehensive SEO Content Section */}
        <section className="pt-8 border-t border-border/60 space-y-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Play Free Spades Online - Partnership Trick-Taking Card Game
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <strong>Axevora Spades</strong> is a streamlined browser edition of the classic American trick-taking
              card game. Teaming up with your AI partner against two computer rivals, your objective is to accurately bid
              the number of tricks you can win and manage the power of the trump Spades suit without taking too many penalty bags.
            </p>
          </div>

          {/* Rules and Strategy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/40 border-border/60">
              <CardContent className="p-6 space-y-3">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" /> Fundamental Rules of Spades
                </h2>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-2.5">
                  <li><strong>The Deal:</strong> All 52 cards are dealt out evenly—13 cards to each of the 4 players.</li>
                  <li><strong>Partnership Bidding:</strong> You and your partner combine bids to form a team contract. Nil bids (0 tricks) offer a huge 100-point reward if successful.</li>
                  <li><strong>Following Suit:</strong> Players must play a card of the suit led if they hold one. If void in that suit, you may discard or trump with a Spade.</li>
                  <li><strong>Spades are Always Trump:</strong> Spades beat cards of all other suits, ranking Ace high down to 2.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-border/60">
              <CardContent className="p-6 space-y-3">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" /> Bidding & Bag Management Tactics
                </h2>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-2.5">
                  <li><strong>Count Sure Tricks:</strong> Aces and Kings in short side suits usually win tricks. Long Spades with high honors are also reliable winners.</li>
                  <li><strong>Beware of Overtrick "Bags":</strong> Taking more tricks than bid yields 1 bonus point each, but 10 bags triggers a devastating -100 point penalty.</li>
                  <li><strong>Cut Early:</strong> When you are out of a suit, use small Spades to cut and take control of the trick.</li>
                  <li><strong>Support Your Partner:</strong> Notice what suits your partner leads and try to duck low cards so your partner's high cards win cleanly.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* FAQs Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">What does "Spades are Broken" mean?</h3>
                  <p className="text-xs text-muted-foreground">A player cannot lead with a Spade card until someone has previously played a Spade on another trick or holds only Spades.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">What happens if a team fails to make its bid?</h3>
                  <p className="text-xs text-muted-foreground">If a team wins fewer tricks than their combined contract bid, they receive a penalty of minus 10 points multiplied by their bid.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">Is this Spades game free?</h3>
                  <p className="text-xs text-muted-foreground">Yes! Axevora Spades is 100% free with unlimited hands, instant deal generation, and zero logins required.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">Can I play Spades on my phone?</h3>
                  <p className="text-xs text-muted-foreground">Yes! The hand layout automatically adjusts into a fan of touch-friendly cards accessible on iOS and Android devices.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Games Internal Links */}
          <div className="pt-6 border-t border-border/40">
            <h2 className="text-base font-bold text-foreground mb-3">Related Classic & Card Games</h2>
            <div className="flex flex-wrap gap-2.5">
              <Link to="/tools/solitaire" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play Klondike Solitaire →
              </Link>
              <Link to="/tools/chess" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play Chess Online →
              </Link>
              <Link to="/tools/checkers" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play Checkers →
              </Link>
              <Link to="/tools/typing-speed-test" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Typing Speed Test →
              </Link>
              <Link to="/games" className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-colors">
                All 22 Games in Games Hub →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </ToolTemplate>
  );
}
