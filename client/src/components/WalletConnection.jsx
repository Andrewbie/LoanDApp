import React, { useState, useEffect } from "react";

const WalletConnection = ({ setCurrentAccount }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setAccount] = useState(null);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("MetaMask is not installed!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setCurrentAccount(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting to MetaMask", error);
    }
  };

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setCurrentAccount(accounts[0]);
          setIsConnected(true);
        }
      }
    };

    checkIfWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setCurrentAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setCurrentAccount(null);
          setIsConnected(false);
        }
      });
    }
  }, [setCurrentAccount]);

  return (
    <div>
      {isConnected ? (
        <p>Connected: {currentAccount}</p>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
};

export default WalletConnection;
