import React from "react";
import { Title } from "@gnosis.pm/safe-react-components";
import { useSafeApp } from "../providers/SafeAppProvider";
import Form from "../components/Form";
import { getIdleTokenId } from "../utils/amounts";
import { Form as FormType, TxData } from "../utils/types";

// TODO fix types
type Props = {
  state: any;
  onBackClick: any;
};

const Deposit: React.FC<Props> = ({ state, onBackClick }) => {
  const { appsSdk } = useSafeApp();

  const handleDeposit = ({ tokenId, strategyId, amountWei }: TxData) => {
    const { underlying, idle } = state.tokens[
      getIdleTokenId(strategyId, tokenId)
    ];

    const txs = [
      {
        to: underlying.contract.address,
        value: "0",
        data: underlying.contract.interface.functions.approve.encode([
          idle.contract.address,
          amountWei,
        ]),
      },
      {
        to: idle.contract.address,
        value: "0",
        data: idle.contract.interface.functions.mintIdleToken.encode([
          amountWei,
          true,
        ]),
      },
    ];

    appsSdk?.sendTransactions(txs);
  };

  return (
    <React.Fragment>
      <Title size="xs">Deposit</Title>
      <Form
        state={state}
        onSubmit={handleDeposit}
        onBackClick={onBackClick}
        formType={FormType.Deposit}
      />
    </React.Fragment>
  );
};

export default Deposit;
