import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InitToken from "./components/InitToken/InitToken";
import SwapTokens from "./components/SwapToken/SwapToken";
import Swapper from "./components/Swapper/Swapper";
import { PageLayout } from "./layout/PageLayout";
import NavItems from "./components/NavItems/NavItems";
import { connect, disconnect } from "@argent/get-starknet";
import { useEffect, useState } from "react";
import SwapToken from "./components/SwapToken/SwapToken";

function App() {
  const [connection, setConnection] = useState("");
  const [account, setAccount] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const starknetConnect = async () => {
      const connected = await connect({
        modalMode: "neverAsk",
        webWalletUrl: "https://web.argent.xyz",
      });
      if (connection && connection.isConnected) {
        setConnection(connection);
        setAccount(connection.account);
        setAddress(connection.selectedAddress);
      }
    };
    starknetConnect();
  }, []);

  const connectWallet = async () => {
    const connection = await connect({
      webWalletUrl: "https://web.argent.xyz",
    });

    if (connection && connection.isConnected) {
      setConnection(connection);
      setAccount(connection.account);
      setAddress(connection.selectedAddress);
    }
  };

  const disconnectWallet = async () => {
    await disconnect();
    setConnection(undefined);
    setAccount(undefined);
    setAddress("");
  };

  const routes = (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitToken account={account} />} />
        <Route path="swap" element={<SwapToken account={account} />} />
        <Route path="swapper" element={<Swapper account={account} />} />
      </Routes>
    </BrowserRouter>
  );
  return (
    <main className="bg-gradient-to-br from-indigo-900 to-purple-400">
      <div className=" text-yellow-50 flex flex-col md:flex-row gap-2 md:gap-4 items-center pt-4 px-[2em] justify-between w-full">
        <p className="font-bold text-2xl">SWAPPER</p>
        <p className="text-xl font-semibold font-mono shadow-md p-2 m-2">
          {address}
        </p>
        {connection ? (
          <button
            className="border rounded-lg shadow-md border-black bg-white text-purple-950 py-2 px-4 mb-2"
            onClick={disconnectWallet}
          >
            Disconnect
          </button>
        ) : (
          <button
            className="border rounded-lg shadow-md border-black bg-white text-purple-950 py-2 px-4 mb-2"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
      <div className="flex flex-col items-center justify-center">
        {/* <PageLayout>{routes}</PageLayout> */}
        {routes}
      </div>
    </main>
  );
}

export default App;
