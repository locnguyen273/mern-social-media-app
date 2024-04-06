import React from 'react'
import { useSelector, useDispatch } from 'react-redux';

const RightSideBar = () => {
  const { auth, suggestions } = useSelector((state) => state);
  const dispatch = useDispatch();
  
  return (
    <div>RightSideBar</div>
  )
}

export default RightSideBar