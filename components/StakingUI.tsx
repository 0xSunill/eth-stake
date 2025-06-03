"use client";

import { useAccount, useDisconnect, useChainId, useConfig } from "wagmi";
import { switchNetwork } from "@wagmi/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function StakingUI() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const chainId = useChainId();
  const config = useConfig();
  const sepoliaChainId = 11155111;
  const isCorrectNetwork = chainId === sepoliaChainId;

  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [stakedBalance, setStakedBalance] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"stake" | "unstake">("stake");

  const handleNetworkSwitch = async () => {
    try {
      await switchNetwork(config, { chainId: sepoliaChainId });
      toast.success("Switched to Sepolia");
    } catch (error) {
      toast.error("Failed to switch network");
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || isNaN(+stakeAmount)) {
      toast.error("Enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      toast.success("Staked successfully (UI-only simulation)");
      setStakedBalance((prev) => (parseFloat(prev) + parseFloat(stakeAmount)).toString());
      setStakeAmount("");
    } catch (error) {
      toast.error("Staking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = () => {
    if (parseFloat(stakedBalance) === 0) {
      toast.error("Nothing to unstake");
      return;
    }
    toast.success("Unstaked successfully (UI-only simulation)");
    setStakedBalance("0");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/5 backdrop-blur-md shadow-xl rounded-3xl border border-gray-700">
        <CardContent className="p-8 space-y-8">
          <div className="flex justify-center gap-6 mb-10">
            <Button
              onClick={() => setTab("stake")}
              className={`text-lg md:text-2xl px-8 md:px-12 py-3 md:py-4 font-bold rounded-full transition-all ${
                tab === "stake"
                  ? "bg-green-400 text-black"
                  : "bg-white text-black border border-gray-600"
              }`}
            >
              Stake
            </Button>
            <Button
              onClick={() => setTab("unstake")}
              className={`text-lg md:text-2xl px-8 md:px-12 py-3 md:py-4 font-bold rounded-full transition-all ${
                tab === "unstake"
                  ? "bg-pink-400 text-black"
                  : "bg-white text-black border border-gray-600"
              }`}
            >
              Unstake
            </Button>
          </div>

          <h1 className="text-4xl font-black text-center text-white drop-shadow-lg">
            Ethereum Staking Portal
          </h1>

          {!isConnected ? (
            <div className="flex justify-center mt-6">
              <ConnectButton showBalance={false} />
            </div>
          ) : !isCorrectNetwork ? (
            <div className="text-center space-y-4">
              <p className="text-red-500 font-bold">⚠️ Wrong Network</p>
              <Button
                onClick={handleNetworkSwitch}
                className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold px-4 py-2 rounded"
              >
                Switch to Sepolia
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center text-gray-400 text-sm">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>

              {tab === "stake" && (
                <div className="space-y-4">
                  <Input
                    placeholder="Enter ETH amount to stake"
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="bg-black/30 text-white placeholder-gray-500 border border-gray-700 rounded-lg"
                  />
                  <Button
                    onClick={handleStake}
                    disabled={loading}
                    className="w-full bg-green-400 hover:bg-green-300 text-black font-bold py-3 rounded-lg"
                  >
                    {loading ? "Staking..." : "Stake ETH"}
                  </Button>
                </div>
              )}

              {tab === "unstake" && (
                <div className="space-y-4">
                  <div className="text-center text-gray-300 text-lg font-semibold">
                    Staked Balance: {stakedBalance} ETH
                  </div>
                  <Button
                    onClick={handleUnstake}
                    className="w-full bg-pink-400 hover:bg-pink-300 text-black font-bold py-3 rounded-lg"
                  >
                    Unstake
                  </Button>
                </div>
              )}

              <Button
                onClick={() => disconnect()}
                variant="outline"
                className="w-full border border-gray-600 hover:bg-gray-800 text-gray-300 mt-8"
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
