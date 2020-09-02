import React, { useCallback } from "react";
import { Title } from "@gnosis.pm/safe-react-components";
import { Form as FormType, TxData, Page } from "../types";
import { useSafeApp } from "../providers/SafeAppProvider";
import { useAppState, useAppDispatch } from "../providers/AppProvider";
import { getIdleTokenId } from "../utils/amounts";
import Form from "../components/Form";

const Deposit: React.FC = () => {
  const { appsSdk } = useSafeApp();
  const { tokens } = useAppState();
  const { goToPage } = useAppDispatch();

  const goToOverview = useCallback(() => goToPage(Page.Overview), [goToPage]);

  const handleDeposit = ({ tokenId, strategyId, amountWei }: TxData) => {
    const { underlying, idle } = tokens[getIdleTokenId(strategyId, tokenId)];

    console.log(underlying, idle);

    const txs = [
      {
        to: "",
        value: "0",
        data: "",
      },
      // {
      //   to: underlying.contract.address,
      //   value: "0",
      //   data: underlying.contract.interface.functions.approve.encode([
      //     idle.contract.address,
      //     amountWei,
      //   ]),
      // },
      // {
      //   to: idle.contract.address,
      //   value: "0",
      //   data: idle.contract.interface.functions.mintIdleToken.encode([
      //     amountWei,
      //     true,
      //   ]),
      // },
    ];

    appsSdk?.sendTransactions(txs);
  };

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
