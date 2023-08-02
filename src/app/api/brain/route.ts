import { NextRequest, NextResponse } from 'next/server';
import axios from "@/library/axios";
import { AxiosError } from 'axios';

const IMAGE_API_URL = process.env.NEXT_PUBLIC_IMAGE_API_URL
const REQUEST_TIMEOUT = 6000

type Data = {
    topRow: number,
    leftCol: number,
    bottomRow: number,
    rightCol: number
};

export async function GET(req: NextRequest) {

    try {
        const url = await req.nextUrl.searchParams.get('url')

        const response = await axios({
            method: "GET",
            url: IMAGE_API_URL,
            params: {
                url: url
            },
            timeout: REQUEST_TIMEOUT,
        })
        
        const data: Data[] = response.data;
        if (data !== undefined) {
            return NextResponse.json({response: data, success: true})
        } else {
            throw new Error('Invalid data')
        }

    } catch (error) {
        if ((error as AxiosError).code === 'ECONNABORTED') {
            return new NextResponse('Request timeout', {status: 504})
        } else {
            return new NextResponse('Internal Server Error', { status: 500 })
        }
    }
}
