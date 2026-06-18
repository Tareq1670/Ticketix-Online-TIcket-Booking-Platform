import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import DashboardWelcome from "@/components/Dashboard/DashboardWelcome";

export default async function DashboardPage() {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }
    console.log(user);

    return <DashboardWelcome user={user} />;
}
