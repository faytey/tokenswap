import React, { createContext, useState } from "react";
import NavItems from "../components/NavItems/NavItems";
import Footer from "../components/Footer/Footer";

export const PageLayout = ({ children }) => {
  // const UserContext = createContext();
  const [account, setAccount] = useState("");
  return (
    // <UserContext.Provider value={(account, setAccount)}>
    <div>
      <header>
        <NavItems />
      </header>
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
    // </UserContext.Provider>
  );
};
