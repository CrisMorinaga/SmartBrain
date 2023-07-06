import { Skeleton } from "@/app/components/shadcn-ui/skeleton"


export function NavSkeleton() {

    return (
        <>
            <div>
                <nav className="flex place-content-between items-center bg-white rounded">
                    <div className="flex flex-row items-center">
                        <Skeleton className="bg-slate-300 w-[50px] h-[50px] rounded-lg my-2 ml-4"/>
                        <Skeleton className="bg-slate-300 h-4 w-14 m-2" />
                    </div>

                    <div className="">
                        <p className=" text-project-blue text-2xl
                        m-2 p-1 mr-4">
                            SmartBrain
                        </p>
                    </div>
                    <div className="flex flex-row items-center">
                        <Skeleton className="bg-slate-300 h-4 w-14 m-2 p1" />
                        <Skeleton className="bg-slate-300 w-10 h-10 rounded-full m-4"/>
                    </div>
                </nav>
            </div>

        </>
    )
}