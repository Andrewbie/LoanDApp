import React, { useState, useEffect } from "react";
import { getContract } from "../utils/ethers";
import { ethers } from "ethers";
import FundLoan from "./FundLoan";
import RepayLoan from "./RepayLoan";

const LoanRequests = ({ refresh }) => {
  const [loans, setLoans] = useState([]);
  const [fundingLoanId, setFundingLoanId] = useState(null);
  const [repayingLoan, setRepayingLoan] = useState(null);

  const fetchLoans = async () => {
    const contract = await getContract();
    if (!contract) return;

    try {
      // Ensure that the contract is defined
      if (typeof contract.getActiveLoanRequests !== "function") {
        console.error(
          "Contract method getActiveLoanRequests is not available."
        );
        return;
      }

      // Fetch active loan requests
      const activeLoans = await contract.getActiveLoanRequests();

      console.log(activeLoans);

      // Check if activeLoans is in the expected format
      if (!Array.isArray(activeLoans)) {
        console.error("Unexpected response format from getActiveLoanRequests");
        return;
      }

      // Format and set loans
      const formattedLoans = activeLoans.map((loan, index) => ({
        loanId: Number(loan.loanId),
        borrower: loan.borrower,
        amount: ethers.formatEther(loan.amount),
        interest: Number(loan.interest),
      }));
      console.log(formattedLoans);
      setLoans(formattedLoans);
    } catch (error) {
      console.error("Error fetching loan requests:", error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [refresh]);

  const handleFundClick = (loanId) => {
    console.log("click");
    setFundingLoanId(loanId);
  };

  const handleRepayClick = (loanId) => {
    // Fetch repayment details before showing the repay component
    setRepayingLoan(loanId);
  };

  return (
    <div>
      <h3>Active Loan Requests</h3>
      {loans.length === 0 ? (
        <p>No active loan requests.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Borrower</th>
              <th>Amount (ETH)</th>
              <th>Interest (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.loanId}>
                <td>{loan.loanId}</td>
                <td>{loan.borrower}</td>
                <td>{loan.amount}</td>
                <td>{loan.interest}</td>
                <td>
                  <button onClick={() => handleFundClick(loan.loanId)}>
                    Fund Loan
                  </button>
                  {/* Implement repay functionality as needed */}
                  {/* <button onClick={() => handleRepayClick(loan.loanId)}>Repay Loan</button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {fundingLoanId && (
        <FundLoan
          loanId={fundingLoanId}
          onLoanFunded={() => {
            setFundingLoanId(null);
            fetchLoans();
          }}
        />
      )}

      {/* Implement repay functionality as needed */}
      {repayingLoan && (
        <RepayLoan
          loanId={repayingLoan}
          amount="Calculated repayment amount"
          onLoanRepaid={() => {
            setRepayingLoan(null);
            fetchLoans();
          }}
        />
      )}
    </div>
  );
};

export default LoanRequests;
