import logo from "./logo.svg";
import "./App.css";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import "./styles/home.css";
import { Web3Button } from "@thirdweb-dev/react";
import { useState } from "react";


const stakingAddress = "0xdd234936eB92D9ae03fe7756a0F573A07bD24f50";
const kurtTokenAddress = "0x7f5F43B57af2987E588222B101A9809F22ae4324";
function App() {
  const address = useAddress();
  const { contract } = useContract(stakingAddress);

  const {contract: stakingToken, isLoading: isStakingTokenLoading} = useContract(kurtTokenAddress);
  
  const { data, isLoading } = useContractRead(contract, "getStakeInfo", [
    address,
  ]);
const[amountToStake, setAmountToStake] = useState(0);
  console.log(data);
  return (
    <>
      <div className="container">
        <main className="main">
          <h1 className="title">Welcome to staking app!</h1>​
          <p className="description">
            Stake certain amount and get reward tokens back!
          </p>
          ​
          <div className="connect">
            <ConnectWallet />
          </div>
          <div className="stakeContainer">
            <input className="textbox" type="number" value={amountToStake} onChange={(e) => setAmountToStake(e.target.value)}/>
             {/* WEB3 BUTTONS START */}
              {/* Stake Button */}
            <Web3Button
              contractAddress={stakingAddress}
              action={async (contract) => {
                
                await stakingToken.setAllowance(stakingAddress, amountToStake);
                await contract.call("stake", [ethers.utils.parseEther(amountToStake)])}}
              theme="dark"
            >
              Stake!
            </Web3Button>
         
          ​  {/* Unstake Button */}
                <Web3Button
                  contractAddress={stakingAddress}
                  action={async (contract) => {
                    await contract.call("withdraw", [
                      ethers.utils.parseEther(amountToStake),
                    ]);
                  }}
                  theme="dark"
                >
                  Unstake
                </Web3Button>
                 {/* Claim Rewards Button */}
                 <Web3Button
                  contractAddress={stakingAddress}
                  action={async (contract) => {
                    await contract.call("claimRewards");
                  }}
                  theme="dark"
                >
                  Claim Rewards!
                </Web3Button>
                {/* WEB3 BUTTONS END */}
              </div>
          <div className="grid">
            <a className="card">
              Staked:{" "}
              {data?._tokensStaked &&
                ethers.utils.formatEther(data?._tokensStaked)}{" "}
              KT <br></br>
            </a>
            <a className="card">
              Rewards:{" "}
              {data?._rewards &&
                Number(ethers.utils.formatEther(data?._rewards)).toFixed(
                  2
                )}{" "}
              BEK
            </a>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
