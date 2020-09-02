import React, { useMemo } from "react";
import { Select } from "@gnosis.pm/safe-react-components";
import { Token, StrategySelectItem } from "../types";

type Props = {
  onChange: (id: string) => void;
  value: string;
  items: StrategySelectItem[];
  tokenId: Token;
};

const filterByToken = (items: StrategySelectItem[], tokenId: Token) => {
  return items.filter((item) => item.tokens.includes(tokenId));
};

const StrategySelect: React.FC<Props> = ({
  onChange = () => {},
  value,
  items,
  tokenId,
}) => {
  const currentItems = useMemo(() => filterByToken(items, tokenId), [
    items,
    tokenId,
  ]);

  return (
    <Select items={currentItems} activeItemId={value} onItemClick={onChange} />
  );
};

export default StrategySelect;
