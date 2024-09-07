import React, { useState } from "react";
import { getContract } from "../utils/ethers";
import { ethers } from "ethers";

const RequestLoan = ({ onLoanRequested }) => {
  const [amount, setAmount] = useState(null);
  const [interest, setInterest] = useState(null);

  const handleRequestLoan = async () => {
    if (!amount || !interest) {
      alert("Please enter both amount and interest.");
      return;
    }

    const contract = await getContract();
    if (!contract) return;

    try {
      // Check if parseEther is available
      if (!ethers || !ethers.parseEther) {
        throw new Error("ethers.utils.parseEther is not defined");
      }

      // Convert amount to ether and request loan
      const amountInEther = ethers.parseEther(amount);
      const tx = await contract.requestLoan(amountInEther, interest);
      console.log("done");
      await tx.wait();
      alert("Loan requested successfully!");
      setAmount(0);
      setInterest(0);
      onLoanRequested();
    } catch (error) {
      console.error("Error requesting loan:", error);
      alert("Failed to request loan.");
    }
  };

  return (
    <div>
      <h3>Request a Loan</h3>
      <input
        type="number"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Interest in %"
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
      />
      <button onClick={handleRequestLoan}>Request Loan</button>
    </div>
  );
};

export default RequestLoan;
