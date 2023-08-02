import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// ////////////////////////////////////////////////////////////
// // Getting img from database for backup

// export function base64ToUint8Array(base64: any) {
//     const binaryString = atob(base64);
//     const length = binaryString.length;
//     const uintArray = new Uint8Array(length);
  
//     for (let i = 0; i < length; i++) {
//       uintArray[i] = binaryString.charCodeAt(i);
//     }
//     return uintArray;
// }

// export function uint8ArrayToDataURL(uint8Array: any) {
//     const blob = new Blob([uint8Array]);
//     const dataURL = URL.createObjectURL(blob);
//     return dataURL;
// }

// //////////////////////////////////////////////////////
// Transform uploaded image to array

export const convertImageToByteArray = async (imageFile: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
    
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            let arrayBuffer = event.target.result;
            if (typeof arrayBuffer === 'string') {
                arrayBuffer = Uint8Array.from(atob(arrayBuffer),
                (c) => c.charCodeAt(0)
                ).buffer;
            }
            const uintArray = new Uint8Array(arrayBuffer);
            const byteArray = Array.from(uintArray);
            resolve(byteArray);
          } else {
            reject(new Error('Failed to read image file'));
          }
        };
    
        reader.onerror = (event) => {
          reject(new Error('Error reading image file'));
        };
    
        reader.readAsArrayBuffer(imageFile);
      });
}

