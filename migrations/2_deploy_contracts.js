const LendingBorrowing = artifacts.require("LendingBorrowing");

module.exports = function (deployer) {
  deployer.deploy(LendingBorrowing);
};
