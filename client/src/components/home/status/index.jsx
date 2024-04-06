import { useSelector, useDispatch } from "react-redux";
import "./style.css";
import Avatar from "./../../avatar/index";
import { GLOBAL_TYPES } from "./../../../redux/actions/globalTypes";

const Status = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <div className="status">
      {/* <div className="">
        <Avatar src={auth.user.avatar} size="big-avatar" className="" />
      </div>
      <button
        onClick={() => dispatch({ type: GLOBAL_TYPES.STATUS, payload: true })}
        className="btn-1 outer-shadow hover-in-shadow statusBtn flex-fill "
        style={{ marginLeft: "7px" }}
      >
        <span style={{ textShadow: "var(--outer-shadow)" }}>
          {auth.user.username}, What is on your mind?
        </span>
      </button> */}
    </div>
  );
};

export default Status;
