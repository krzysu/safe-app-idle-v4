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
  updateTokenPrice: any;
};

const Withdraw: React.FC<Props> = ({
  state,
  onBackClick,
  updateTokenPrice,
}) => {
  const { appsSdk } = useSafeApp();

  const handleWithdraw = ({ tokenId, strategyId, amountWei }: TxData) => {
    const { idle } = state.tokens[getIdleTokenId(strategyId, tokenId)];

    const txs = [
      {
        to: idle.contract.address,
        value: "0",
        data: idle.contract.interface.functions.redeemIdleToken.encode([
          amountWei,
          true,
          [],
        ]),
      },
    ];

    appsSdk?.sendTransactions(txs);
  };

  return (
    <React.Fragment>
      <Title size="xs">Withdraw</Title>

      <Form
        state={state}
        onSubmit={handleWithdraw}
        onBackClick={onBackClick}
        updateTokenPrice={updateTokenPrice}
        formType={FormType.Withdraw}
      />
    </React.Fragment>
  );
};

export default Withdraw;
