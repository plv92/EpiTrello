import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/user-button";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import Link from "next/link";

export const Navbar = async () => {
    const cookieStore = cookies();
    const session = cookieStore.get("session")?.value;
    const orgId = cookieStore.get("currentOrgId")?.value;
    const authResult = await auth();

    return ( 
        <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
            <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
                <Logo />
                <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
                    {authResult.isValid && authResult.user ? (
                        <>
                            <Button size="sm" variant="outline" asChild>
                                <Link href={orgId ? `/organization/${orgId}` : "/select-org"}>
                                    Dashboard
                                </Link>
                            </Button>
                            <UserButton user={authResult.user} />
                        </>
                    ) : session ? (
                        <>
                            <form action="/api/sign-out" method="POST" className="inline">
                                <Button size="sm" variant="destructive" type="submit">
                                    Session expirée - Se reconnecter
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Button size="sm" variant="outline" asChild>
                                <Link href="/sign-in">
                                    Login
                                </Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/sign-up">
                                    Get Epitrello for free
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
