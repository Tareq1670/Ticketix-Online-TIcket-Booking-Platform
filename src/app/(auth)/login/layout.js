// app/login/layout.js

export const metadata = {
    title: "Login | TicketHub",
    description: "Access your TicketHub account to book tickets for buses, trains, launches, and events across Bangladesh seamlessly.",
    keywords: [
        "TicketHub Login",
        "Sign In TicketHub",
        "Online Ticket Booking",
        "Bus Ticket Account",
        "Train Ticket Login",
        "Bangladesh Ticket Booking"
    ],
    openGraph: {
        title: "Login to TicketHub",
        description: "Securely sign in to your TicketHub portal and book your tickets instantly.",
        type: "website",
    },
};

const LoginLayout = ({ children }) => {
    return (
        <div>
            {children}
        </div>
    );
};

export default LoginLayout;