import { lazy } from "react";

export const LazyLanding = lazy(() => import('../Landing'));
export const LazyProfile=lazy(()=>import('../Profile'))
export const LazyRegister=lazy(()=>import('../MainComponnets/RegisterUser'))