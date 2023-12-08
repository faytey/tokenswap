import "./App.css";
import InitToken from "./components/InitToken/InitToken";
import { connect, disconnect } from "@argent/get-starknet";
import { useEffect, useState } from "react";

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
  return (
    <main className="bg-gradient-to-br from-indigo-900 to-purple-400 h-screen flex flex-col items-center">
      <div className=" text-yellow-50 flex flex-col md:flex-row gap-2 md:gap-4 items-center mt-4 px-[2em] justify-between w-full">
        <p>SWAPPER</p>
        <p>{address}</p>
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
      <InitToken account={account} />
    </main>
  );
}

export default App;
