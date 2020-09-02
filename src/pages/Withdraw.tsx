import React, { useCallback } from "react";
import { Title } from "@gnosis.pm/safe-react-components";
import { Form as FormType, TxData, Page } from "../utils/types";
import { useSafeApp } from "../providers/SafeAppProvider";
import { useAppState, useAppDispatch } from "../providers/AppProvider";
import { getIdleTokenId } from "../utils/amounts";
import Form from "../components/Form";

const Withdraw: React.FC = () => {
  const { appsSdk } = useSafeApp();
  const { tokens } = useAppState();
  const { goToPage } = useAppDispatch();

  const goToOverview = useCallback(() => goToPage(Page.Overview), [goToPage]);

  const handleWithdraw = ({ tokenId, strategyId, amountWei }: TxData) => {
    const { idle } = tokens[getIdleTokenId(strategyId, tokenId)];

    console.log(idle);

    const txs = [
      {
        to: "",
        value: "0",
        data: "",
      },
      // {
      //   to: idle.contract.address,
      //   value: "0",
      //   data: idle.contract.interface.functions.redeemIdleToken.encode([
      //     amountWei,
      //     true,
      //     [],
      //   ]),
      // },
    ];

    appsSdk?.sendTransactions(txs);
  };

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
