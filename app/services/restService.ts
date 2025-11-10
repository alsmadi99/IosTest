import { Languages } from '../common';
import { set, isEmpty } from 'lodash';
import Store from '../store';

interface AppServiceParams {
  url: string;
  method: 'POST' | 'get' | 'put' | 'OPTIONS' | 'DELETE';
  params?: any;
  headers?: any;
}

export default function AppService({
  url,
  method,
  params,
  headers = {},
}: AppServiceParams) {
  const { getState } = Store;
  const { auth } = getState();
  const { user } = auth;

  set(headers, 'Accept', 'application/json');
  set(headers, 'Content-Type', 'application/json');
  user && set(headers, 'token', `${user?.token}`);

  if (url?.charAt(url?.length - 1) == '&') {
    url = url + `plang=${Languages.LangID}`;
  } else if (url?.charAt(url?.length - 1) == '?') {
    url = url + `plang=${Languages.LangID}`;
  } else {
    url = url + `&plang=${Languages.LangID}`;
  }

  __DEV__ && console.log('\n url', JSON.stringify(url));
  const reqBody: {
    method: 'POST' | 'get' | 'put' | 'OPTIONS' | 'DELETE';
    headers: any;
    body?: any;
  } = {
    method,
    headers,
  };

  if (!isEmpty(params)) {
    //Add your localization here in general or add it to the URL if its a GET request
    reqBody.body = JSON.stringify({ ...params, plang: Languages.LangID });
    // reqBody.body = JSON.stringify(params);
  }

  __DEV__ && console.log('\n BODY ', JSON.stringify(reqBody));

  return fetch(url, reqBody)
    .then((response) => response.json())
    .then((data) => {
      __DEV__ && console.log('RESPONSE', JSON.stringify(data));
      return {
        result: 'ok',
        data,
      };
    })
    .catch((error) => {
      __DEV__ && console.error(url, error + '');
      return {
        result: 'error',
        data: null,
        message: 'Please check your internet connection!',
      };
    })
    .catch((error) => {
      __DEV__ && console.error(url, error + '');
      return {
        result: 'error',
        data: null,
        message: 'Please check your internet connection!',
      };
    });
}
