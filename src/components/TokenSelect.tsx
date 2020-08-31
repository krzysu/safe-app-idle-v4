import React, { useMemo } from "react";
import { Select } from "@gnosis.pm/safe-react-components";
import { TokenSelectItem } from "../utils/buildSelectItems";
import { Strategy } from "../utils/types";

type Props = {
  onChange: (id: string) => void;
  value: string;
  items: TokenSelectItem[];
  strategyId: Strategy;
};

const filterByStrategy = (items: TokenSelectItem[], strategyId: Strategy) => {
  return items.filter((item) => item.strategies.includes(strategyId));
};

const TokenSelect: React.FC<Props> = ({
  onChange = () => {},
  value = "dai",
  items,
  strategyId,
}) => {
  const currentItems = useMemo(() => filterByStrategy(items, strategyId), [
    items,
    strategyId,
  ]);

  return (
    <Select items={currentItems} activeItemId={value} onItemClick={onChange} />
  );
};

export default TokenSelect;
