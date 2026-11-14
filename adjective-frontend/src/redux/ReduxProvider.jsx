"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import AuthInitializer from "@/components/auth/AuthInitializer";

export default function ReduxProvider({ children }) {
    return (
        <Provider store={store}>
            <AuthInitializer>{children}</AuthInitializer>
        </Provider>
    );
}