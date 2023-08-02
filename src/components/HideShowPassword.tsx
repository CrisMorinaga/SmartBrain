'use client'

import hide from "@/HideShowPasswordComponent/hide.webp"
import show from "@/HideShowPasswordComponent/show.webp"
import Image from "next/image"

type Props = {
    togglePasswordVisibility: () => void,
    showPassword: Boolean
}

export default function HideShowPassword({togglePasswordVisibility, showPassword}: Props) {

    return (
        <Image
        height={30}
        className="cursor-pointer border rounded bg-white mb-1"
        onClick={togglePasswordVisibility} 
        src={showPassword ? hide : show} alt=''
        />
    )
}