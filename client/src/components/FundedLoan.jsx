import React, { useEffect, useState } from "react";
import { getContract } from "../utils/ethers";
import { ethers } from "ethers";
import RepayLoan from "./RepayLoan";

const FundedLoan = ({refresh}) => {
  const [userLoan, setUserLoan] = useState([])
  const [repayId, setRepayId] = useState(null)
  const [repayAmount, setRepayAmount] = useState(null)

  const getUser = async () => {
    const provider = new ethers.BrowserProvider(ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    console.log("the signer is", signer.address);
    return signer.address;
  };

  const fetchLoans = async () => {
    const contract = await getContract();
    if (!contract) return;

    try {
      // Ensure that the contract is defined
      if (typeof contract.getAllLoans !== "function") {
        console.error("Contract method getAllLoans is not available.");
        return;
      }

      // Fetch active loan requests
      const allLoans = await contract.getAllLoans();

      console.log(allLoans);

      // Check if activeLoans is in the expected format
      if (!Array.isArray(allLoans)) {
        console.error("Unexpected response format from getActiveLoanRequests");
        return;
      }

      const userac = await getUser();
    //   console.log("This one is active user ", userac);

      // Format and set loans
      const formattedLoans = allLoans.map((loan, index) => ({
        loanId: Number(loan.loanId),
        borrower: loan.borrower,
        amount: ethers.formatEther(loan.amount),
        interest: Number(loan.interest),
        lender: loan.lender,
        isRepaid: loan.isRepaid,
        isActive: loan.isActive,
      }));
    //   console.log(formattedLoans);

      const userLoans = formattedLoans.filter((loan) => {
        return loan.borrower == userac ? loan : "";
      });

      console.log(userLoans);
        setUserLoan(userLoans);
    } catch (error) {
      console.error("Error fetching loan requests:", error);
    }
  };

  const handleRepay = (loanId, loanAmount)=>{
    setRepayId(loanId);
    setRepayAmount(loanAmount)
  }

  useEffect(() => {
    fetchLoans();
  }, [refresh]);

  return (
    <>
        <h3>Your loans</h3>
        <div>
            {userLoan.map((item)=>(
                <div style={{display:"flex", gap:"25px", alignItems:"center"}} key={item.loanId}>
                    <div>
                    {item.loanId}
                    </div>
                    <div>{item.lender}</div>
                    <div>{item.amount}</div>
                    <div>{item.interest}</div>
                    <div>{Number(item.amount)+((item.interest/100)*item.amount)}</div>
                    {item.isRepaid &&
                    <button disabled>Paid</button>}
                    {!item.isRepaid && item.isActive &&
                    <button disabled>Not Funded Yet</button>}
                    {!item.isRepaid && !item.isActive &&
                    <button onClick={()=> handleRepay(item.loanId, (Number(item.amount)+((item.interest/100)*item.amount)))}>Repay</button>
}
                </div>
            ))}

            {
                repayId && <RepayLoan loanId={repayId} amount={repayAmount}/>
            }
        </div>
    </>
  )
};

export default FundedLoan;
