import axios from 'axios';
import { useEffect, useRef, useState } from 'react'

function useAxios(url, options = {}) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const cache = useRef({});

    useEffect(()=> {
      if(cache.current[url]){
        setData(cache.current[url]);
        setLoading(false);
        return
      }
      const fetchData = async () => {
        setLoading(true);
        try{
          const response = await axios.get(url, options);
          setData(response.data);
          cache.current[url] = response.data;
        } catch(err){
          setError(err);
        }finally{
          setLoading(false)
        }
      };
      fetchData()
        
    }, [url, options])
  return (
    {data, error, loading}
  )
}

export default useAxios
