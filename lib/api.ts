import ROUTES from "@/constants/route";
import { fetchHandler } from "./handlers/fetch";
import { Account, BookingRoomItem, RoomType, User } from "@prisma/client";
import { BookingDetails, SignInWithOAuthParams } from "@/types/action";
import { DateRange } from "react-day-picker";


const API_BASE_URL = `http://localhost:3000/api`;

export const api = {
    auth: {
        oAuthSignIn: ({
            user,
            provider,
            providerAccountId
        }: SignInWithOAuthParams) => 
            fetchHandler(`${API_BASE_URL}/auth/${ROUTES.SIGN_IN_WITH_OAUTH}`, {
                method: "POST",
                body: JSON.stringify({ user, provider, providerAccountId })
            }),
    },
    users: {
        getAll: () => fetchHandler(`${API_BASE_URL}/users`),
        getById: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`),
        getByEmail: (email: string) =>
            fetchHandler(`${API_BASE_URL}/users/email`, {
              method: "POST",
              body: JSON.stringify({ email }),
            }),
        create: (userData: Partial<User>) => 
            fetchHandler(`${API_BASE_URL}/users`, {
                method: "POST",
                body: JSON.stringify(userData)
            }),
        update: (id: string, userData: Partial<User>) => 
            fetchHandler(`${API_BASE_URL}/users/${id}`, {
                method: "POST",
                body: JSON.stringify(userData)
            }),
        delete: (id: string) => 
            fetchHandler(`${API_BASE_URL}/users/${id}`, {
                method: "DELETE"
            })
    },
    accounts: {
        getAll: () => fetchHandler(`${API_BASE_URL}/accounts`),
        getById: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`),
        getByProvider: (providerAccountId: string) => fetchHandler(`${API_BASE_URL}/accounts/provider`, {
            method: "POST",
            body: JSON.stringify({ providerAccountId })
        }),
        getByProviderAttachUser: (providerAccountId: string) => fetchHandler(`${API_BASE_URL}/accounts/provider/user`, {
            method: "POST",
            body: JSON.stringify({ providerAccountId })
        }),
        create: (accountData: Partial<Account>) => 
            fetchHandler(`${API_BASE_URL}/accounts`, {
                method: "POST",
                body: JSON.stringify(accountData)
            }),
        update: (id: string, accountData: Partial<Account>) => 
            fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
                method: "POST",
                body: JSON.stringify(accountData)
            }),
        delete: (id: string) => 
            fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
                method: "DELETE"
            })
    },
    roomsType: {
        getAll: () => fetchHandler(`${API_BASE_URL}/roomsType`),
        getById: (id: string) => fetchHandler(`${API_BASE_URL}/roomsType/${id}`),
        getByFilter: (branchName: string, guestAllocations: { adults: number; children: number; infants: number }[], dateRange: DateRange | undefined) => 
            fetchHandler(`${API_BASE_URL}/roomsType/filter`, {
                method: "POST",
                body: JSON.stringify({ branchName, guestAllocations, dateRange })
            }),
        create: (roomData: Partial<RoomType>) => 
            fetchHandler(`${API_BASE_URL}/roomsType`, {
                method: "POST",
                body: JSON.stringify(roomData)
            }),
        update: (id: string, roomData: Partial<RoomType>) => 
            fetchHandler(`${API_BASE_URL}/roomsType/${id}`, {
                method: "POST",
                body: JSON.stringify(roomData)
            }),
        delete: (id: string) => 
            fetchHandler(`${API_BASE_URL}/roomsType/${id}`, {
                method: "DELETE"
            })
    },
    bookings: {
        getAll: () => fetchHandler(`${API_BASE_URL}/bookings`),
        getById: (id: string) => fetchHandler(`${API_BASE_URL}/bookings/${id}`),
        getHistory: () => 
            fetchHandler(`${API_BASE_URL}/bookings/history`),
        create: (bookingData: Partial<BookingDetails>) => 
            fetchHandler(`${API_BASE_URL}/bookings`, {
                method: "POST",
                body: JSON.stringify(bookingData)
            }),
        update: (id: string, bookingData: Partial<BookingRoomItem>) => 
            fetchHandler(`${API_BASE_URL}/bookings/${id}`, {
                method: "POST",
                body: JSON.stringify(bookingData)
            }),
        delete: (id: string) => 
            fetchHandler(`${API_BASE_URL}/bookings/${id}`, {
                method: "DELETE"
            }),
    },
    payments: {
        createCheckoutSession: (bookingId: string) =>
            fetchHandler(`${API_BASE_URL}/payments/create-checkout-session`, {
                method: "POST",
                body: JSON.stringify({ bookingId }),
            }),
        getByBookingId: (bookingId: string) =>
            fetchHandler(`${API_BASE_URL}/payments/${bookingId}`),
    },
    hotelBranchRoomType: {
        getQuantityById: (roomTypeId: string, hotelBranchId: string, dateRange: DateRange | undefined) =>
            fetchHandler(`${API_BASE_URL}/hotelBranchRoomType/quantity`, {
                method: "POST",
                body: JSON.stringify({ roomTypeId, hotelBranchId, dateRange })
            }),
    },
    admin: {
        stats: {
            getOverview: () => fetchHandler(`${API_BASE_URL}/admin/stats`),
            revenueTrend: (days = 30) => fetchHandler(`${API_BASE_URL}/admin/stats/revenue-trend?days=${days}`),
            bookingsByStatus: () => fetchHandler(`${API_BASE_URL}/admin/stats/bookings-by-status`),
        },
        bookings: {
            getAll: (params: URLSearchParams) => fetchHandler(`${API_BASE_URL}/admin/bookings?${params}`),
            getById: (id: string) => fetchHandler(`${API_BASE_URL}/admin/bookings/${id}`),
            updateStatus: (id: string, status: string) =>
                fetchHandler(`${API_BASE_URL}/admin/bookings/${id}`, {
                    method: "PATCH",
                    body: JSON.stringify({ status }),
                }),
        },
        payments: {
            getAll: (params: URLSearchParams) => fetchHandler(`${API_BASE_URL}/admin/payments?${params}`),
        },
        branches: {
            getAll: (params: URLSearchParams) => fetchHandler(`${API_BASE_URL}/admin/branches?${params}`),
            getById: (id: string) => fetchHandler(`${API_BASE_URL}/admin/branches/${id}`),
            create: (data: { name: string; location: string }) =>
                fetchHandler(`${API_BASE_URL}/admin/branches`, {
                    method: "POST",
                    body: JSON.stringify(data),
                }),
            update: (id: string, data: { name?: string; location?: string }) =>
                fetchHandler(`${API_BASE_URL}/admin/branches/${id}`, {
                    method: "PATCH",
                    body: JSON.stringify(data),
                }),
        },
        roomTypes: {
            getAll: (params: URLSearchParams) => fetchHandler(`${API_BASE_URL}/admin/room-types?${params}`),
            create: (data: Partial<RoomType>) =>
                fetchHandler(`${API_BASE_URL}/admin/room-types`, { method: "POST", body: JSON.stringify(data) }),
            update: (id: string, data: Partial<RoomType>) =>
                fetchHandler(`${API_BASE_URL}/admin/room-types/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
        },
        inventory: {
            getAll: (params: URLSearchParams) => fetchHandler(`${API_BASE_URL}/admin/inventory?${params}`),
            create: (data: { hotelBranchId: string; roomTypeId: string; quantity: number }) =>
                fetchHandler(`${API_BASE_URL}/admin/inventory`, { method: "POST", body: JSON.stringify(data) }),
            update: (id: string, data: { quantity?: number; status?: string }) =>
                fetchHandler(`${API_BASE_URL}/admin/inventory/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
        },
    },
}