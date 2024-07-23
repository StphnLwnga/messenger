import { NextResponse } from 'next/server';
import axios from 'axios';

export const POST = async (req: Request):Promise<NextResponse> => {
  try {
    const { query, variables } = await req.json();

    if (!query || !variables) throw new Error('Invalid request');

    const res = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
      query,
      variables,
    }, {
      headers: { 'Content-Type': 'application/json', }
    });
    
    const {data} = res?.data;
    const {code, success} = data;
    
    if (code !== 200 && !success) throw new Error(`${query}: ${data?.message}`);

    return NextResponse.json({ ...data }, { status: 200 });
  } catch (error: any) {
    console.log('Error: ', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}