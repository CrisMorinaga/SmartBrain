import logo from '@/Logo/Logo.webp'
import Image from 'next/image'

type Props ={
    router: any
}

export function Logo ({router}: Props) {

    return (
        <>
            <div className="ml-4 my-2">
                <div style={{ height: 'auto', width: '50px'}}>
                    <Image 
                    className='rounded drop-shadow-xl cursor-pointer' 
                    onClick={() => router.push('/')} 
                    priority={true} 
                    src={logo} 
                    alt='logo'/>
                </div>
            </div>
        </>
    )
}