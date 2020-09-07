import { ethers } from "ethers";
import { viewHelperAbi } from "../abis";
import { Network } from "../SafeAppProvider";

const viewHelperAddress = {
  mainnet: "0xae2Ebae0a2bC9a44BdAa8028909abaCcd336b8f5",
  rinkeby: "",
};

export const initHelperContract = async (
  provider: ethers.providers.JsonRpcProvider,
  network: Network
): Promise<ethers.Contract> => {
  const contract = new ethers.Contract(
    viewHelperAddress[network],
    viewHelperAbi,
    provider
  );
  return contract;
};
