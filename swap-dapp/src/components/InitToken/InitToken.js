import React, { useState } from "react";
import { Contract, RpcProvider } from "starknet";
import initAbi from "../../utils/abis/initTokenAbi.json";

function InitToken({ account }) {
  const [data, setData] = useState("");
  const [address, setAddress] = useState("");

  const provider = new RpcProvider({
    nodeUrl: process.env.NEXT_PUBLIC_RPC,
  });

  const initAddress =
    "0x0001a5cf7662dd884123aa8020f417521152789a1d01b0ef1188a25461decca7";

  const writeContract = new Contract(initAbi, initAddress, account);

  const getBalance = async () => {
    try {
      const readContract = new Contract(initAbi, initAddress, provider);

      const balance = await readContract.get_total_supply();

      setData(balance.toString());
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
    <main className="bg-purple-200 px-8 py-2 md:py-8 flex flex-col items-center justify-center rounded-3xl shadow-2xl gap-8 w-[70%] h-[70%] md:h-[50%] mb-2 mt-[4em] md:mt-[6em]">
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
  );
}

export default InitToken;
