import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LazyLanding, LazyProfile, LazyRegister, LazyVerifyId, LazyVaccancyPost } from "./LazyLoading/LazyLoader";
import { useUser } from "@clerk/clerk-react";
import useUserStore from "./Zustand/UserStore";
import Navbar from "./MainComponnets/Navbar";
import PostVaccancy from "./MainComponnets/PostVaccancy";
import JobApplication from "./Comps/JobApplications";
import { Toaster } from "sonner";
import Trial from "./MainComponnets/trial";
import ChatApp from "./ChatApp";
import TestCard from "./TestCard";
import HomeMaker from './HomeMakerHome';
import Trends from './trends';
import ShareCode from "./ShareCode";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    },
  },
});

const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white">
    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

function AppRoutes() {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser(); 

  const SetCurrentUser = useUserStore((state) => state.setCurrentUser);
  const ClearCurrentUser = useUserStore((state) => state.ClearCurrentUser);
  const setIsRegistered = useUserStore((state) => state.setIsRegistered);
  const ClearIsRegistered = useUserStore((state) => state.ClearIsRegistered);
  const setUserType = useUserStore((state) => state.setUserType);
  const clearUserType = useUserStore((state) => state.clearUserType);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const res = await fetch("/api/getusertype/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: user.id }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        const userType = result.userType;
        console.log(userType, "usertype");
        
        if (userType) {
          setUserType(userType);
          // Only navigate to home if not already on a specific route
          if (location.pathname === '/' || location.pathname === '') {
            navigate(`/home/${userType}`);
          }
        } else {
          console.warn("User type not found in response", result);
        }
      } catch (error) {
        console.error("Failed to fetch user type:", error);
      }
    };

    // Clear user type when user signs out
    if (!isSignedIn) {
      clearUserType();
      ClearCurrentUser();
      ClearIsRegistered();
    } else if (user?.id && isLoaded && isSignedIn) {
      fetchUserType();
    }
  }, [user?.id, isLoaded, isSignedIn, navigate, setUserType, clearUserType, ClearCurrentUser, ClearIsRegistered]);

  return (
    <>
      <Navbar  />
      <Toaster />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Trial />} />
          <Route path="/register-usr" element={<LazyRegister />} />
          <Route path="/verify-usr" element={<LazyVerifyId />} />
          <Route path="/vaccancy-post" element={<PostVaccancy />} />
          <Route path="/posts" element={<JobApplication />} />
          <Route path="/chat" element={<ChatApp />} />
          <Route path="/test" element={<TestCard />} />
          <Route path="/home/:type" element={<HomeMaker />} />
          <Route path="/latestTrends" element={<Trends />} />
          <Route path='/code' element={<ShareCode/>}/>
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
