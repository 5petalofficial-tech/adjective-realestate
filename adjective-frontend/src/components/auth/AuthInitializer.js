"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "@/redux/authSlice";

/**
 * components/AuthInitializer.js
 *
 * The access token lives in memory only (see lib/apiClient.js), so a hard
 * page refresh loses it. This runs once on app mount and uses the httpOnly
 * refresh cookie (via GET /auth/me → 401 → auto-refresh interceptor) to
 * silently re-establish the session without bothering the user.
 *
 * Wire it into your root layout, INSIDE your existing Redux <Provider>:
 *
 *   <Provider store={store}>
 *     <AuthInitializer>
 *       {children}
 *     </AuthInitializer>
 *   </Provider>
 */
export default function AuthInitializer({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    return children;
}
