import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Router, useRouter } from "next/router";

const useFetch = (
  url = "",
  method = "post",
  params = {},
  immediate = true,
  headers = {},
  token = true
) => {
  // states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const source = axios.CancelToken.source();

  // cookies
  const [cookies, setCookies, clearCookies] = useCookies(["user"]);

  // router
  const router = useRouter();

  // useCallBack for post submit ..
  const executeFetch = useCallback(
    async (data, isFormData = false) => {
      setLoading(true);
      setData(null);
      setError(null);
      let _data =
        isFormData === true
          ? data
          : {
              ...params,
              ...data,
            };
      try {
        const { data: response } = await axios({
          method: method,
          url: url,
          data: _data,
          headers: {
            ...headers,
            lang: "en",
            Authorization: `Bearer ${cookies?.user?.token}`,
          },
          timeout: 1000 * 40, // wait to 10 seconds for response or cancel the request ..
        });
        setLoading(false);
        if (response?.status === true) {
          setData(response); // setting incomed data here
        } else {
          setError(
            response?.description ??
              "Something went wrong! Please try again later"
          ); // setting error here
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          // dispatch(startLogout());
          router.push("/login");
          clearCookies("user");
        }
      }
    },
    [url, method, params, headers, token]
  );

  // useEffects
  useEffect(async () => {
    if (immediate) {
      immediate = false;
      executeFetch();
    }
    return () => {
      source.cancel(); // clear axios when this hook unmounted
    };
  }, [immediate]);

  return { data, loading, error, executeFetch };
};

export default useFetch;
