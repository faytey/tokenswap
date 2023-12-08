import React, { useState } from "react";
import { Contract, RpcProvider } from "starknet";
import swapAbi from "../../utils/abis/swapTokenAbi.json";
import NavItems from "../NavItems/NavItems";
import Footer from "../Footer/Footer";

function SwapToken({ account }) {
  const [data, setData] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const provider = new RpcProvider({
    nodeUrl: process.env.NEXT_PUBLIC_RPC,
  });

  const swapAddress =
    "0x0571ce0e4d85fb6b0406fad82996ea8dead2700812c3521227f4e8a66ff8dc79";

  const writeContract = new Contract(swapAbi, swapAddress, account);

  const getBalance = async () => {
    try {
      const readContract = new Contract(swapAbi, swapAddress, provider);

      const balance = await readContract.get_total_supply();

      setData(balance.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  const getName = async () => {
    try {
      const readContract = new Contract(swapAbi, swapAddress, provider);

      const name = await readContract.get_name();

      setName(name.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  const mint = async () => {
    try {
      await writeContract.mint(address);
      alert("Mint Successful");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <header>
        <NavItems />
      </header>
      <main className="bg-purple-200 px-8 py-2 md:py-8 flex flex-col items-center justify-center rounded-3xl shadow-2xl gap-8 w-[90%] md:h-[50%] mb-6 mt-[4em]">
        <p
          className="text-xl text-center font-bold shadow-indigo-800"
          onLoad={getName()}
        >
          Token: {name}
        </p>

        <p
          className="text-xl text-center font-bold shadow-indigo-800"
          onLoad={getBalance()}
        >
          Total Supply is {data}
        </p>
        <div className="flex flex-col gap-4 items-center w-[80%]">
          <label htmlFor="mint" className="text-2xl font-bold text-purple-600">
            Enter a Braavos/Argent Wallet Address
          </label>
          <br />
          <input
            className="w-full rounded-2xl px-4 py-2 text-purple-950 outline-purple-800 outline-none"
            typeof="text"
            id="mint"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <br />
        <button
          className="border-2 text-xl py-3 px-8 rounded-lg border-purple-950"
          typeof="submit"
          onClick={mint}
        >
          {" "}
          Mint{" "}
        </button>
      </main>
      <Footer />
    </>
  );
}

export default SwapToken;
