// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LendingBorrowing {

    struct LoanRequest {
        uint loanId;         // Loan ID in the struct
        address borrower;
        uint amount;
        uint interest;
        bool isActive;
        address lender;
        bool isRepaid;
    }

    uint public loanCounter = 0;
    mapping(uint => LoanRequest) public loanRequests;

    event LoanRequested(uint loanId, address borrower, uint amount, uint interest);
    event LoanFunded(uint loanId, address lender, uint amount, uint interest);
    event LoanRepaid(uint loanId, address borrower, uint amount, uint interest);

    // Borrower requests a loan
    function requestLoan(uint _amount, uint _interest) external {
        loanCounter++;
        loanRequests[loanCounter] = LoanRequest({
            loanId: loanCounter,      // Store loanId in struct
            borrower: msg.sender,
            amount: _amount,
            interest: _interest,
            isActive: true,
            lender: address(0),
            isRepaid: false
        });
        
        emit LoanRequested(loanCounter, msg.sender, _amount, _interest);
    }

    // Lender funds the loan request
    function fundLoan(uint _loanId) external payable {
        LoanRequest storage loan = loanRequests[_loanId];

        require(loan.isActive, "Loan is not active");
        require(loan.borrower != address(0), "Invalid loan request");
        require(msg.value == loan.amount, "Incorrect loan amount");
        require(loan.lender == address(0), "Loan is already funded");

        loan.lender = msg.sender;
        loan.isActive = false;

        // Transfer loan amount to the borrower
        payable(loan.borrower).transfer(msg.value);

        emit LoanFunded(_loanId, msg.sender, loan.amount, loan.interest);
    }

    // Borrower repays the loan with interest
    function repayLoan(uint _loanId) external payable {
        LoanRequest storage loan = loanRequests[_loanId];

        require(loan.lender != address(0), "Loan not funded yet");
        require(msg.sender == loan.borrower, "Only borrower can repay");
        
        uint repaymentAmount = loan.amount + (loan.amount * loan.interest / 100);
        require(msg.value == repaymentAmount, "Incorrect repayment amount");

        // Transfer repayment amount (loan + interest) to the lender
        payable(loan.lender).transfer(msg.value);
        loan.isRepaid = true;

        emit LoanRepaid(_loanId, msg.sender, loan.amount, loan.interest);
    }

    // Helper function to view active loan requests
    function getActiveLoanRequests() external view returns (LoanRequest[] memory) {
        uint activeCount = 0;

        // Count active loans
        for (uint i = 1; i <= loanCounter; i++) {
            if (loanRequests[i].isActive) {
                activeCount++;
            }
        }

        // Create an array of active loans
        LoanRequest[] memory activeLoans = new LoanRequest[](activeCount);
        uint index = 0;
        for (uint i = 1; i <= loanCounter; i++) {
            if (loanRequests[i].isActive) {
                activeLoans[index] = loanRequests[i];
                index++;
            }
        }

        return activeLoans;
    }

    // Helper function to view funded loans for a borrower
    function getFundedLoansByBorrower(address _borrower) external view returns (LoanRequest[] memory) {
        uint fundedCount = 0;

        // Count funded loans for the borrower that are not yet repaid
        for (uint i = 1; i <= loanCounter; i++) {
            if (loanRequests[i].borrower == _borrower && loanRequests[i].lender != address(0) && !loanRequests[i].isRepaid) {
                fundedCount++;
            }
        }

        // Create an array for funded loans
        LoanRequest[] memory fundedLoans = new LoanRequest[](fundedCount);
        uint index = 0;

        for (uint i = 1; i <= loanCounter; i++) {
            if (loanRequests[i].borrower == _borrower && loanRequests[i].lender != address(0) && !loanRequests[i].isRepaid) {
                fundedLoans[index] = loanRequests[i]; // Include loanId in the returned struct
                index++;
            }
        }

        return fundedLoans;
    }

    // New function to get all loans (funded, unfunded, repaid)
    function getAllLoans() external view returns (LoanRequest[] memory) {
        LoanRequest[] memory allLoans = new LoanRequest[](loanCounter);

        // Populate the array with all loans
        for (uint i = 1; i <= loanCounter; i++) {
            allLoans[i - 1] = loanRequests[i];
        }

        return allLoans;
    }
}
