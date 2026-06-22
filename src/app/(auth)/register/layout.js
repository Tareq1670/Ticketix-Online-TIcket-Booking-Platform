export const metadata = {
    title: "Register | Ticketix - Seamless Online Ticket Booking",
    description:
        "Create an account on Ticketix to book tickets for buses, trains, movies, and events online. Fast, secure, and easy booking experience.",
    keywords:
        "Ticketix registration, create account, online ticket booking, bus ticket, train ticket, event tickets",
    openGraph: {
        title: "Join Ticketix - Book Your Tickets Online",
        description:
            "Sign up for Ticketix and start booking your tickets today!",
        siteName: "Ticketix",
        type: "website",
    },
};

const registerLayout = ({ children }) => {
    return <section>{children}</section>;
};

export default registerLayout;
