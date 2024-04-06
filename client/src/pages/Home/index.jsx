
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Introduce from '../../components/home/introduce';
import Status from './../../components/home/status/index';
import LoadIcon from "../../assets/images/loading.gif";
import Posts from './../../components/home/posts/index';
import RightSideBar from './../../components/home/right-side-bar/index';

const Home = () => {
  const [showHomePage, setShowHomePage] = useState(true);
  const { auth } = useSelector((state) => state);
  // const { homePosts } = useSelector(state => state);
  const homePosts = {
    loading: false,
    result: 0,
  }
  
  console.log(auth)
  useEffect(() => {
    if(auth.status) {
      setShowHomePage(true);
    }
  }, [auth, showHomePage]);

  return (
    <>
    {showHomePage ? <div className="home row mx-0">
        <div className="col-md-8">
          <Status />
          {homePosts.loading ? (
            <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
          ) : (homePosts.result === 0 ? <h2 className="text-center">No Post</h2> :<Posts />
          )}
        </div>

        <div className="col-md-4">
          <RightSideBar />
        </div>
      </div> : 
      <Introduce />
    }
    </>
  )
}

export default Home