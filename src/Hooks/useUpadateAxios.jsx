import axios from 'axios';
import { useEffect, useRef, useState } from 'react'

function useUpdateAxios(url, options = {}) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const cache = useRef({});
    const CACHE_EXPIRY_TIME = 1000 * 60 * 5;
    useEffect(()=> {
      const cachedData = cache.current[url];
      const currentTime = Date.now();
      if(cachedData && (currentTime - cachedData.timestamp < CACHE_EXPIRY_TIME)){
        setData(cache.current[url]);
        setLoading(false);
        return;
      }
      const fetchData = async () => {
        setLoading(true);
        try{
          const response = await axios.get(url, options);
          setData(response.data);
          cache.current[url] = { data: response.data, timestamp: currentTime };
        } catch(err){
          setError(err);
        }finally{
          setLoading(false)
        }
      };
      fetchData()
        
    }, [url, options, CACHE_EXPIRY_TIME])
  return (
    {data, error, loading}
  )
}

export default useUpdateAxios
