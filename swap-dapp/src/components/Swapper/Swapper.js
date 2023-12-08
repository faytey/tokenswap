import React, { useState } from "react";
import { Contract, RpcProvider } from "starknet";
import swapper from "../../utils/abis/swapperAbi.json";
import NavItems from "../NavItems/NavItems";
import Footer from "../Footer/Footer";

function Swapper({ account }) {
  const [init, setInit] = useState("");
  const [swap, setSwap] = useState("");
  const [initAmount, setInitAmount] = useState("");
  const [swapAmount, setSwapAmount] = useState("");

  const provider = new RpcProvider({
    nodeUrl: process.env.NEXT_PUBLIC_RPC,
  });

  const swapperAddress =
    "0x03bc0ba6254229e63fd9bdaaf82c4e2ab0640a8ea5265804d5250d095541943e";

  const writeContract = new Contract(swapper, swapperAddress, account);

  const getInitToSwapperRatio = async () => {
    try {
      const readContract = new Contract(swapper, swapperAddress, provider);

      const balance = await readContract.get_init_to_swapper_ratio();

      setInit(balance.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  const getSwapperToInitRatio = async () => {
    try {
      const readContract = new Contract(swapper, swapperAddress, provider);

      const balance = await readContract.get_swapper_to_init_ratio();

      setSwap(balance.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  const swapInit = async () => {
    try {
      await writeContract.swap_init_tokens_for_swapper_tokens(initAmount);
      alert("Swap Successful");
    } catch (error) {
      console.log(error.message);
    }
  };

  const swapSwapper = async () => {
    try {
      await writeContract.swap_swapper_tokens_for_init_tokens(swapAmount);
      alert("Swap Successful");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <header>
        <NavItems />
      </header>
      <main className="bg-gradient-to-tr from-purple-400 to-indigo-900 px-8 py-2 md:py-8 flex flex-col items-center justify-center rounded-3xl shadow-2xl gap-8 w-[90%] md:h-[50%] mb-6 mt-[4em]">
        <p className="text-yellow-200 font-bold text-2xl">
          Interact with Swapper
        </p>
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-8 w-full">
          <div className="bg-purple-200 flex flex-col gap-4 justify-center items-center py-4 px-8 rounded-md shadow-xl w-[80%]">
            <button
              className="text-xl text-center font-bold shadow-indigo- border-2 py-3 px-8 rounded-lg border-purple-950"
              onClick={getInitToSwapperRatio}
            >
              Get Init to Swapper Ratio
            </button>
            <p>{init}</p>
          </div>

          <div className="bg-purple-200 flex flex-col gap-4 justify-center items-center py-4 px-8 rounded-md shadow-xl w-[80%]">
            <button
              className="text-xl text-center font-bold shadow-indigo-800 border-2 py-3 px-8 rounded-lg border-purple-950"
              onClick={getSwapperToInitRatio}
            >
              Get Swapper to Init Ratio
            </button>
            <p>{swap}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-8 w-full">
          <div className="bg-purple-200 flex flex-col gap-4 justify-center items-center py-4 px-8 rounded-md shadow-xl w-[80%]">
            <div className="flex flex-col gap-4 items-center">
              <label
                htmlFor="init"
                className="text-xl font-bold text-purple-600"
              >
                Swap Init Tokens For Swapper Tokens
              </label>
              <input
                className="w-full rounded-2xl px-4 py-2 text-purple-950 outline-purple-800 outline-none"
                typeof="text"
                id="init"
                value={initAmount}
                onChange={(e) => setInitAmount(e.target.value)}
              />
            </div>
            <br />
            <button
              className="border-2 text-xl py-3 px-8 rounded-lg border-purple-950"
              typeof="submit"
              onClick={swapInit}
            >
              {" "}
              Swap{" "}
            </button>
          </div>

          <div className="bg-purple-200 flex flex-col gap-4 justify-center items-center py-4 px-8 rounded-md shadow-xl w-[80%]">
            <div className="flex flex-col gap-4 items-center">
              <label
                htmlFor="swap"
                className="text-xl font-bold text-purple-600"
              >
                Swap Swapper Tokens For Init Tokens
              </label>
              <input
                className="w-full rounded-2xl px-4 py-2 text-purple-950 outline-purple-800 outline-none"
                typeof="text"
                id="swap"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
              />
            </div>
            <br />
            <button
              className="border-2 text-xl py-3 px-8 rounded-lg border-purple-950"
              typeof="submit"
              onClick={swapSwapper}
            >
              {" "}
              Swap{" "}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Swapper;
