import React, { useState } from 'react';
import WalletConnection from './components/WalletConnection';
import LoanRequests from './components/LoanRequests';
import RequestLoan from './components/RequestLoan';
import FundLoan from './components/FundLoan';
import RepayLoan from './components/RepayLoan';
import { getContract } from './utils/ethers';
import FundedLoan from './components/fundedloan';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [repaymentDetails, setRepaymentDetails] = useState(null);

  const handleLoanRequested = () => {
    setRefresh(!refresh);
  };

  const handleLoanFunded = () => {
    setRefresh(!refresh);
  };

  const handleLoanRepaid = () => {
    setRefresh(!refresh);
  };

  // Fetch loan details for repayment if necessary
  const fetchRepaymentDetails = async (loanId) => {
    const contract = await getContract();
    if (!contract) return;

    try {
      const loan = await contract.loanRequests(loanId);
      const repaymentAmount = ethers.formatEther(loan.amount.add(loan.amount.mul(loan.interest).div(100)));
      setRepaymentDetails({ loanId, amount: repaymentAmount });
    } catch (error) {
      console.error('Error fetching loan details:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>DeFiHub DApp</h1>
      <WalletConnection setCurrentAccount={setCurrentAccount} />
      {currentAccount && (
        <div>
          <p>Connected Account: {currentAccount}</p>
          <RequestLoan onLoanRequested={handleLoanRequested} />
          <LoanRequests refresh={refresh} />
          <FundedLoan refresh={refresh}/>
        </div>
      )}
    </div>
  );
};

export default App;
