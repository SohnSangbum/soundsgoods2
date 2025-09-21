import React from "react";
import { FaAngleRight } from "react-icons/fa6";
import Recomnedplaylist from "./Recomnedplaylist";

const Recommendplay = () => {
  return (
    <div className="Recomnedplaylist">
      <div className="recommendList">
        <div className="recommnedlisttitle">
          <h2>최애 아티스트</h2>
          <FaAngleRight />
        </div>
        <Recomnedplaylist />
      </div>
    </div>
  );
};

export default Recommendplay;
