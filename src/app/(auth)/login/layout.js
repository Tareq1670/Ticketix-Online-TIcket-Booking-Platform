// app/login/layout.js

export const metadata = {
    title: "Login | Ticketix",
    description: "Access your Ticketix account to book tickets for buses, trains, launches, and events across Bangladesh seamlessly.",
    keywords: [
        "Ticketix Login",
        "Sign In Ticketix",
        "Online Ticket Booking",
        "Bus Ticket Account",
        "Train Ticket Login",
        "Bangladesh Ticket Booking"
    ],
};

const LoginLayout = ({ children }) => {
    return (
        <div>
            {children}
        </div>
    );
};

export default LoginLayout;