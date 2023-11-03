import { useEffect, useState } from 'react';
import axios from 'axios';

function useFetch({ initState, getData, condition = true, deps = []}) {

  const [data, setData] = useState(initState)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    let isMounted = false;
    if (!isMounted) {
      initFetch();
    }
    return () => {
      isMounted = true;
    };
  }, deps);

  const initFetch = async () => {
    if (condition) {
      setLoading(true)
      try {
        // const res = await getData;
        const res = await axios.get('https://jsonplaceholder.typicode.com/posts');
        setData(res.data)
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false)
      }
    }
  };

  return { data, loading }
}

export default useFetch;
