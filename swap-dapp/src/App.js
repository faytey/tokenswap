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
    <main className="bg-purple-900 h-screen flex flex-col items-center">
      <p className=" text-yellow-50">Token Swapper</p>
      <InitToken />
      {connection ? (
        <button onClick={disconnectWallet}>Disconnect</button>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      <p>{address}</p>
    </main>
  );
}

export default App;
