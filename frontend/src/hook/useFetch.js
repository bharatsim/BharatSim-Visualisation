import { useEffect, useState } from 'react';
import useDeepCompareMemoize from './useDeepCompareMemoize';

const defaultApiParameters = [];

function useFetch(api, apiParameters = defaultApiParameters, shouldFetch = true) {
  const [responseData, setResponseData] = useState();

  const memoizeValue = useDeepCompareMemoize(apiParameters);

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }
    async function fetchApiData() {
      const resData = await api(...apiParameters);
      setResponseData(resData);
    }

    fetchApiData();
  }, memoizeValue);

  return { data: responseData };
}

export default useFetch;
