"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function StakingUI() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakedBalance, setStakedBalance] = useState("0");
  const [tab, setTab] = useState<"stake" | "unstake">("stake");
  const [loading, setLoading] = useState(false);

  const handleStake = () => {
    if (!stakeAmount || isNaN(+stakeAmount) || +stakeAmount <= 0) {
      toast.error("Invalid stake amount");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Staked!");
      setStakedBalance((prev) =>
        (parseFloat(prev) + parseFloat(stakeAmount)).toString()
      );
      setStakeAmount("");
      setLoading(false);
    }, 1000);
  };

  const handleUnstake = () => {
    if (parseFloat(stakedBalance) === 0) {
      toast.error("Nothing to unstake");
      return;
    }
    toast.success("Unstaked!");
    setStakedBalance("0");
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <Card className="max-w-xl w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-xl text-white">
        <CardContent className="p-8 sm:p-10 space-y-8">
          <div className="flex justify-center gap-4">
            <Button
              className={`rounded-full px-6 py-2 text-lg font-semibold transition-all duration-300 ${
                tab === "stake"
                  ? "bg-gradient-to-r from-green-400 to-lime-400 text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setTab("stake")}
            >
              Stake
            </Button>
            <Button
              className={`rounded-full px-6 py-2 text-lg font-semibold transition-all duration-300 ${
                tab === "unstake"
                  ? "bg-gradient-to-r from-pink-400 to-red-400 text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setTab("unstake")}
            >
              Unstake
            </Button>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-center">
            Ethereum Staking Portal
          </h1>

          {!isConnected ? (
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-center text-sm text-gray-400">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>

              {tab === "stake" ? (
                <div className="space-y-4">
                  <Input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Enter ETH amount"
                    className="bg-white/10 text-white border border-white/20 rounded-md focus:ring-2 focus:ring-green-400"
                  />
                  <Button
                    onClick={handleStake}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-400 to-lime-400 text-black font-bold py-3 rounded-md hover:opacity-90 transition"
                  >
                    {loading ? "Staking..." : "Stake ETH"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <p className="text-lg">
                    Staked Balance: <span className="font-bold">{stakedBalance} ETH</span>
                  </p>
                  <Button
                    onClick={handleUnstake}
                    className="w-full bg-gradient-to-r from-pink-400 to-red-400 text-black font-bold py-3 rounded-md hover:opacity-90 transition"
                  >
                    Unstake
                  </Button>
                </div>
              )}

              <Button
                variant="ghost"
                onClick={disconnect}
                className="w-full text-white hover:bg-white/10 border border-white/20 rounded-md"
              >
                Disconnect Wallet
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
