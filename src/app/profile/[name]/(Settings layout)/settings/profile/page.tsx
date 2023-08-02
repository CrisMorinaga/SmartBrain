'use client'

import { Separator } from "@/components/shadcn-ui/separator"
import { ProfileForm } from "./profile-form"

export default function SettingsProfilePage() {
    
    return (
        <>  
            <div className="space-y-8">
                <div>
                <h3 className="text-lg font-medium text-white">Profile</h3>
                <p className="text-sm text-project-text-color">
                This is how others will see you on the site.
                </p>
                </div>
                <Separator />
                <ProfileForm />
            </div>
        </>
    )
}