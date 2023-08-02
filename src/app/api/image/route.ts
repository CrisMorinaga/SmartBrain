// import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from "next-auth/jwt";
// import { storage } from "@/firebase/clientApp"
// import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"

// const IMAGE_LINK = process.env.NEXT_PUBLIC_IMG_LINK

// export async function POST(req: NextRequest) {

//     const functionUsage = await req.nextUrl.searchParams.get('function')
//     const token = await getToken({ req })

//     if (functionUsage === 'delete') {
//         const user_id = token?.id
//         const imageRef = ref(storage, `${IMAGE_LINK}${user_id}`)

//         try {   
//             await deleteObject(imageRef)
//             return NextResponse.json({response: 'Image Deleted', success: true});

//         } catch (error) {
//             return new NextResponse(`Error: ${error}`, {status: 500})
//         }
//     }
// }
