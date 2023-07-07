'use client'

import { useSession } from "next-auth/react"
import { useEffect } from "react";
import axios, { axiosAuth } from "../axios";


const useAxiosAuth = () => {
    const { data: session, update } = useSession();

    useEffect(() => {
        const requestIntercept = axiosAuth.interceptors.request.use((config) => {
            if (!config.headers['Authorization']){
                config.headers['Authorization'] = `Bearer ${session?.user.access_token}`;
            }
            return config;
        });

        const responseIntercept = axiosAuth.interceptors.response.use((response) => {
            if (response.data.access_token) {
                update({...session, 
                    user: {
                        ...session?.user,
                        access_token: response.data.access_token
                    }   
                });
            }
            return response
        });

        return () => {
            axiosAuth.interceptors.request.eject(requestIntercept);
            axiosAuth.interceptors.response.eject(responseIntercept)
        };
    }, [session])

    return axiosAuth;
}

export default useAxiosAuth;