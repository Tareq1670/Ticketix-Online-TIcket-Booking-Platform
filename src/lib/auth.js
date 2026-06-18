import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { cookies } from "next/headers";

const client = new MongoClient(process.env.TICKETIX_URI);
const db = client.db("Ticketix");

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        disableSignUp: false,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    database: mongodbAdapter(db, {
        client,
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
                input: true,
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user, ctx) => {
                    let role = "user";

                    if (user.role && ["user", "vendor"].includes(user.role)) {
                        role = user.role;
                    } else {
                        try {
                            const cookieStore = await cookies();
                            const pendingRole =
                                cookieStore.get("pending_role")?.value;

                            if (
                                pendingRole &&
                                ["user", "vendor"].includes(pendingRole)
                            ) {
                                role = pendingRole;
                            }
                        } catch (err) {}
                    }

                    return {
                        data: {
                            ...user,
                            role: role,
                        },
                    };
                },
            },
        },
    },
});