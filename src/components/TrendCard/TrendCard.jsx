import React from "react";
import { TrendData } from "../../Data/TrendData";

import "./TrendCard.css";

const TrendCard = () => {
  return (
    <div className="TrendCard">
      <h3>Trending topics</h3>
      {TrendData.map((trend, idx) => (
        <div key={idx}>
          <span>#{trend.name}</span>
          <span>{trend.shares}k shares</span>
        </div>
      ))}
    </div>
  );
};

export default TrendCard;
