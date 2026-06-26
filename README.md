# 🎫 Ticketix - Online Ticket Booking Platform

An advanced, multi-modal online ticketing marketplace designed to streamline ticket booking across various transport sectors including Buses, Trains, Launches, and Airplanes. Ticketix connects Passengers, Transport Vendors, and Platform Administrators into a unified, secure, and highly efficient ecosystem.

🔗 **Live Application:** [Ticketix Live](https://ticketix-online-t-icket-booking-pla.vercel.app/)  
📁 **Frontend Repository:** [GitHub Client](https://github.com/Tareq1670/Ticketix-Online-TIcket-Booking-Platform)  
📁 **Backend Repository:** [GitHub Server](https://github.com/Tareq1670/Ticketix-Online-Ticket-Booking-Platform-server)  

---

## 🚀 Project Purpose
The primary goal of **Ticketix** is to eliminate the fragmentation in the transport ticketing industry. Instead of visiting different websites or counters for buses, trains, launches, or flights, users can manage all their travel bookings from a single, centralized hub. The platform features an end-to-end workflow ensuring safety, data verification, and secure transactions between vendors and passengers under administrative supervision.

---

## ✨ Key Features

### 👥 Passenger / User End
* **All-in-One Multi-Transport Booking:** Search and book tickets for Buses, Trains, Launches, and Flights from a single interface.
* **Dynamic Booking Pipeline:** Easily request bookings, track real-time status updates, and manage travel history.
* **Secure Confirmation Workflow:** Pay and fully secure tickets once the corresponding vendor formally accepts the booking request.

### 🏢 Vendor Management
* **Ticket Provisioning:** Create and upload detailed listings for seats, schedules, routes, pricing, and transport types.
* **Booking Control Panel:** Review incoming ticket requests from users with the ability to accept or reject bookings based on real-time fleet availability.
* **Product Visibility Queue:** Newly created tickets enter a verification phase before becoming visible to the public.

### 🛡️ Administrative Oversight
* **Strict Quality Control:** Dedicated Admin dashboard to review, audit, and verify all newly uploaded vendor transport listings.
* **Verification Gate:** Tickets are only displayed live on the public website after explicit approval from an Administrator, minimizing fraudulent listings and data mismatches.

---

## 🛠️ Technology Stack & Dependencies

### Frontend Ecosystem
* **Next.js** - Production-grade React framework for Server-Side Rendering (SSR) and seamless routing.
* **Tailwind CSS** - Utility-first styling framework for fluid, rapid UI layout styling.
* **Hero UI** - Modern, accessible, and beautiful component library providing an optimized user experience.
* **Better Auth** - Comprehensive and modern authentication framework handling secure sessions and role management.
* **React Icons & Gravity UI Icons** - Scalable vector icons ensuring sharp and clean visual indicators.
* **React Hot Toast** - Responsive, lightweight toast notification system providing real-time user feedback.

### Backend & Database Architecture
* **Express.js** - Fast, unopinionated, minimalist web framework for managing secure RESTful API services.
* **Node.js** - Scalable asynchronous event-driven JavaScript runtime engine.
* **MongoDB** - Flexible NoSQL document database optimized for high-performance complex data queries and dynamic transport scheduling structures.

## 📌 Project Overview

**TicketiX** is a modern, full-featured **Online Ticket Booking Platform** where users can seamlessly 
book tickets for **Buses 🚌, Trains 🚆, Launches 🚢, Airplanes ✈️, and all other types of transport 
or events** — all in one place.

The platform connects **three key roles**:
- 👤 **Users** — Browse and book tickets
- 🏪 **Vendors** — Upload and manage their ticket listings
- 🛡️ **Admins** — Approve vendor tickets before they go live on the platform

TicketiX ensures a **secure, smooth, and transparent** booking experience from ticket discovery 
to payment confirmation.

---


## 🎯 Purpose

The goal of **TicketiX** is to eliminate the hassle of physical ticket counters and bring 
**all types of transport ticket bookings** under a single digital roof. Whether you're traveling 
by bus, train, launch, or plane — TicketiX makes it fast, easy, and secure.

---


## 🔄 How It Works — Step by Step

```mermaid
graph TD
    A[Vendor Uploads Ticket] --> B[Admin Reviews Ticket]
    B --> C{Admin Decision}
    C -->|Approved ✅| D[Ticket Goes Live on Platform]
    C -->|Rejected ❌| E[Ticket Not Published]
    D --> F[User Browses & Books Ticket]
    F --> G[Vendor Reviews Booking Request]
    G --> H{Vendor Decision}
    H -->|Accepted ✅| I[User Gets Payment Option]
    H -->|Rejected ❌| J[Booking Cancelled]
    I --> K[User Completes Payment]
    K --> L[Booking Confirmed ✅]
