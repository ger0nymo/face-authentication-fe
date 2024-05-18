"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {Loader2} from "lucide-react";
import {signIn} from "@/api/user.api";
import Link from "next/link";
import {useToast} from "@/components/ui/use-toast";
import VerificationDialog from "@/components/ui/verification-dialog";
const formSchema = z.object({
    email: z.string().email({message: "Invalid email address."}),
    password: z.string().min(6, {message: "Password must be at least 6 characters."}),
});

export default function LoginPage() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [loading, setLoading] = useState(false);
    const {toast} = useToast();
    const [verificationToken, setVerificationToken] = useState<string | null>(null);
    const [showVerificationDialog, setShowVerificationDialog] = useState(false);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);

        const result = await signIn(data.email, data.password);

        if(!result) {
            toast({
                title: "Error",
                description: "An error occurred while signing in. Please make sure your email and password are correct.",
                variant: "error",
                duration: 3000
            });
            setLoading(false);
        } else {
            if (result.status === 200) {
                localStorage.setItem('user', JSON.stringify(result.data.user));
                localStorage.setItem('token', result.data.token);
                router.push('/');
                setLoading(false);
            } else if (result.status === 210) {
                setVerificationToken(result.data.verification_token);
                setShowVerificationDialog(true);
            }
        }
    };

    return (
        <div>
            <div className="flex flex-col items-center justify-center min-h-screen pb-16">
                <VerificationDialog
                    open={showVerificationDialog}
                    onOpenChange={(open: boolean) => {
                        setShowVerificationDialog(open);
                        if (!open) setLoading(false);
                    }}
                    token={verificationToken}
                />
                <h1 className="scroll-m-10 border-b pb-4 text-2xl font-semibold tracking-tight first:mt-0 mb-12">
                    Face authentication project
                </h1>
                <Card className="w-full max-w-sm">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <CardHeader>
                                <CardTitle className="text-2xl">Login</CardTitle>
                                <CardDescription>
                                    Enter your details below to login to your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Password" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" type="submit" disabled={loading}>
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    ) : (
                                        "Sign in"
                                    )}
                                </Button>
                            </CardFooter>
                            <div className="pb-6 text-center text-sm">
                                {"Don't have an account?"}
                                <Link href="/register" className="underline pl-2">
                                    Sign up
                                </Link>
                            </div>
                        </form>
                    </Form>
                </Card>
            </div>
        </div>
    );
}