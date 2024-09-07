import React, { useState } from "react";
import { getContract } from "../utils/ethers";
import { ethers } from "ethers";

const RepayLoan = ({ loanId, amount, onLoanRepaid }) => {
  const [repaymentAmount, setRepaymentAmount] = useState("");

  const handleRepayLoan = async () => {
    if (!repaymentAmount) {
      alert("Please enter the repayment amount.");
      return;
    }

    const contract = await getContract();
    if (!contract) return;

    try {
      const tx = await contract.repayLoan(loanId, {
        value: ethers.parseEther(String(amount)),
      });
      await tx.wait();
      alert("Loan repaid successfully!");
      setRepaymentAmount("");
      onLoanRepaid();
    } catch (error) {
      console.error("Error repaying loan:", error);
    }
  };

  return (
    <div>
      <h4>Repay Loan ID: {loanId}</h4>
      <p>Amount to Repay: {amount} ETH</p>
      <input
        type="number"
        placeholder="Repayment Amount in ETH"
        value={repaymentAmount}
        onChange={(e) => setRepaymentAmount(e.target.value)}
      />
      <button onClick={handleRepayLoan}>Repay Loan</button>
    </div>
  );
};

export default RepayLoan;
