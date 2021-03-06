import React, { useCallback } from "react";
import { Title } from "@gnosis.pm/safe-react-components";
import { Form as FormType, TxData, Page } from "../types";
import { useSafeApp } from "../providers/SafeAppProvider";
import { useAppState, useAppDispatch } from "../providers/AppProvider";
import { getIdleTokenId } from "../utils/amounts";
import Form from "../components/Form";

const Withdraw: React.FC = () => {
  const { appsSdk } = useSafeApp();
  const { contracts } = useAppState();
  const { goToPage } = useAppDispatch();

  const goToOverview = useCallback(() => goToPage(Page.Overview), [goToPage]);

  const handleWithdraw = useCallback(
    ({ tokenId, strategyId, amountWei }: TxData) => {
      const { idleContract } = contracts[getIdleTokenId(strategyId, tokenId)];

      const txs = [
        {
          to: idleContract.address,
          value: "0",
          data: idleContract.interface.encodeFunctionData("redeemIdleToken", [
            amountWei,
          ]),
        },
      ];

      appsSdk?.sendTransactions(txs);
      goToOverview();
    },
    [appsSdk, contracts, goToOverview]
  );

  return (
    <React.Fragment>
      <Title size="xs">Withdraw</Title>

      <Form
        onSubmit={handleWithdraw}
        onBackClick={goToOverview}
        formType={FormType.Withdraw}
      />
    </React.Fragment>
  );
};

export default Withdraw;
