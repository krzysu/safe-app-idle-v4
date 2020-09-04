import React, { useCallback } from "react";
import { ethers } from "ethers";
import { Title } from "@gnosis.pm/safe-react-components";
import { Form as FormType, TxData, Page } from "../types";
import { useSafeApp } from "../providers/SafeAppProvider";
import { useAppState, useAppDispatch } from "../providers/AppProvider";
import { getIdleTokenId } from "../utils/amounts";
import Form from "../components/Form";

const Deposit: React.FC = () => {
  const { appsSdk } = useSafeApp();
  const { contracts } = useAppState();
  const { goToPage } = useAppDispatch();

  const goToOverview = useCallback(() => goToPage(Page.Overview), [goToPage]);

  const handleDeposit = useCallback(
    ({ tokenId, strategyId, amountWei }: TxData) => {
      const { underlyingContract, idleContract } = contracts[
        getIdleTokenId(strategyId, tokenId)
      ];

      const txs = [
        {
          to: underlyingContract.address,
          value: "0",
          data: underlyingContract.interface.encodeFunctionData("approve", [
            idleContract.address,
            amountWei,
          ]),
        },
        {
          to: idleContract.address,
          value: "0",
          data: idleContract.interface.encodeFunctionData(
            "mintIdleToken(uint256,bool,address)",
            [
              amountWei,
              true,
              process.env.REACT_APP_REFERRAL_ADDRESS ||
                ethers.constants.AddressZero,
            ]
          ),
        },
      ];

      appsSdk?.sendTransactions(txs);
      goToOverview();
    },
    [appsSdk, contracts, goToOverview]
  );

  return (
    <React.Fragment>
      <Title size="xs">Deposit</Title>
      <Form
        onSubmit={handleDeposit}
        onBackClick={goToOverview}
        formType={FormType.Deposit}
      />
    </React.Fragment>
  );
};

export default Deposit;
