import axios from 'axios';

import { SHOP_URL } from '@/constant/list';

import type { NaverProductResponse } from '@/constant/type';

const getProductsApi = async (params: object) => {
  try {
    const { data }: { data: NaverProductResponse } = await axios.get(SHOP_URL, {
      params,
      headers: {
        'X-Naver-Client-Id': process.env.NEXT_PUBLIC_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NEXT_PUBLIC_CLIENT_SECRET,
      },
    });
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default getProductsApi;
