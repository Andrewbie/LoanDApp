import { ethers, JsonRpcProvider } from "ethers";
import LendingBorrowing from "../abis/LendingBorrowing.json";
// import 'dotenv/config'

const getEthereumObject = () => {
  if (
    typeof ethereum !== "undefined" &&
    typeof window.ethereum !== "undefined"
  ) {
    return window.ethereum;
  } else {
    console.error("MetaMask is not installed!");
    return null;
  }
};

export const getContract = async () => {
  try {
    const ethereum = getEthereumObject();
    if (!ethereum) {
      alert("Please install MetaMask!");
      return null;
    }

    // Initialize provider
    // const provider = new ethers.providers.Web3Provider(ethereum);
    const provider = new ethers.BrowserProvider(ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    console.log(signer);

    // Fetch network ID
    const networkId = await ethereum.request({ method: "net_version" });

    // Ensure the contract address is set
    const contractAddress = "0x2eC572f5f0C53cdD1CC08c55e8801fF1f52faAc0";
    if (!contractAddress) {
      console.error("Contract address not set in the environment variables.");
      return null;
    }
    console.log("done");
    // Initialize the contract
    const contract = new ethers.Contract(
      contractAddress,
      LendingBorrowing.abi,
      signer
    );

    return contract;
  } catch (error) {
    console.error("Error in getContract: ", error);
    return null;
  }
};
