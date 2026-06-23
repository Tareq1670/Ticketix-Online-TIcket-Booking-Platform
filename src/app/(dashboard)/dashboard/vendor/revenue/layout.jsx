export const metadata = {
    title: "Revenue Overview | TicketBari Vendor Dashboard",
    description:
        "Track your ticket sales, total revenue, and performance analytics. View detailed insights on tickets added, sold, and earnings across different transport types.",
    keywords: [
        "vendor revenue",
        "ticket sales analytics",
        "revenue dashboard",
        "ticket booking revenue",
        "vendor earnings",
        "TicketBari vendor",
    ],
    openGraph: {
        title: "Revenue Overview | TicketBari Vendor Dashboard",
        description:
            "Monitor your ticket sales performance, total revenue, and detailed analytics in real-time.",
        type: "website",
        siteName: "TicketBari",
    },
    twitter: {
        card: "summary_large_image",
        title: "Revenue Overview | TicketBari",
        description:
            "Track ticket sales, revenue and performance analytics for vendors.",
    },
    robots: {
        index: false,
        follow: false,
    },
};

const RevenueLayout = ({ children }) => {
    return children;
};

export default RevenueLayout;
