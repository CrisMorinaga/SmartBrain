'use client'
import Tilt from 'react-parallax-tilt'
import logo from './Logo.png'
import Image from 'next/image'

export function Logo () {
    return (
        <>
            <div className="m-4 mt-0 container flex">
                <Tilt>
                    <div style={{ height: '100px', width: '100px'}}>
                        <Image className='rounded drop-shadow-xl' src={logo} alt='logo'/>
                    </div>
                </Tilt>
            </div>
        </>
    )
}