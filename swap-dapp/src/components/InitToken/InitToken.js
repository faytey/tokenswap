import React, { useState } from "react";
import { Contract, Provider, Account } from "starknet";
import initAbi from "../../utils/abis/initTokenAbi.json";

function InitToken() {
  const [data, setData] = useState("");

  const getBalance = async () => {
    const provider = new Provider({
      sequencer: { network: process.env.NEXT_PUBLIC_RPC },
    });
    try {
      const initAddress =
        "0x0001a5cf7662dd884123aa8020f417521152789a1d01b0ef1188a25461decca7";

      const contract = new Contract(initAbi, initAddress, provider);

      const balance = await contract.get_balance_of_user();

      setData(balance.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <main>
      <button onClick={getBalance}>Get Balance</button>
      <p>{data}</p>
      {/* <div>
        <label htmlFor="mint">Enter your Braavos/Argent Wallet Address</label>
        <br />
        <input
          typeof="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <br />
        <button typeof="submit"> Mint </button>
      </div> */}
    </main>
  );
}

export default InitToken;
