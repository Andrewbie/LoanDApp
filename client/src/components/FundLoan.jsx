import React, { useState } from "react";
import { getContract } from "../utils/ethers";
import { ethers } from "ethers";

const FundLoan = ({ loanId, onLoanFunded }) => {
  const [amount, setAmount] = useState("");

  const handleFundLoan = async () => {
    if (!amount) {
      alert("Please enter the amount to fund.");
      return;
    }

    const contract = await getContract();
    if (!contract) return;

    try {
      const tx = await contract.fundLoan(loanId, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      alert("Loan funded successfully!");
      setAmount("");
      onLoanFunded();
    } catch (error) {
      console.error("Error funding loan:", error);
    }
  };

  return (
    <div>
      <h4>Fund Loan ID: {loanId}</h4>
      <input
        type="number"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleFundLoan}>Fund Loan</button>
    </div>
  );
};

export default FundLoan;
