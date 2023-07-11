import { Separator } from "@/app/components/shadcn-ui/separator"
import { AccountForm } from "./account-form"

export default function SettingsAccountPage() {
  return (
    <div className="space-y-10 pb-8">
      <div>
        <h3 className="text-lg font-medium text-white">Account</h3>
        <p className="text-sm text-muted-foreground text-project-text-color">
          Update your account settings. Change your name, email and password.
        </p>
      </div>
      <Separator />
      <AccountForm />
    </div>
  )
}