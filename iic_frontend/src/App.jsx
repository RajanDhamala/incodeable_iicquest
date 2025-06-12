import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LazyLanding,LazyProfile,LazyRegister,LazyVerifyId,LazyVaccancyPost } from "./LazyLoading/LazyLoader";
import { useUser } from "@clerk/clerk-react";
import useUserStore from "./Zustand/UserStore";
import Navbar from "./MainComponnets/Navbar";
import PostVaccancy from "./MainComponnets/PostVaccancy";
import JobApplication from "./Comps/JobApplications";
import { Toaster } from "sonner"
import Trial from "./MainComponnets/trial";
import ChatApp from "./ChatApp";
import TestCard from "./TestCard";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    },
  },
});

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
};

function App() {
    const {user,loading}=useUser()
    const SetCurrentUser = useUserStore((state) => state.setCurrentUser);
    const ClearCurrentUser = useUserStore((state) => state.ClearCurrentUser);
    const setIsRegistered = useUserStore((state) => state.setIsRegistered);
    const ClearIsRegistered = useUserStore((state) => state.ClearIsRegistered);

  useEffect(()=>{
      if(user){
        console.log(user)
        const data={
          _id:user.id,
          username:user.fullName,
          imageUrl:user.imageUrl,
          email:user.primaryEmailAddress.emailAddress
        }
        SetCurrentUser(data)
      } else if (!loading && !user) {
        ClearCurrentUser()
        ClearIsRegistered()
      }
  },[loading,user,SetCurrentUser,ClearCurrentUser,setIsRegistered,ClearIsRegistered])
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false}/>
      <BrowserRouter>
        <Navbar />
          <Toaster />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Trial />} />
            <Route path="/profile" element={<LazyProfile />} />
             <Route path="/register-usr" element={<LazyRegister />} />
              <Route path="/verify-usr" element={<LazyVerifyId/>} />
              <Route path="/vaccancy-post" element={<PostVaccancy/>} />
                <Route path="/posts" element={<JobApplication/>} />
                <Route path="/chat" element={<ChatApp/>} />
                <Route path="/test" element={<TestCard/>} />
             
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
    </>
  )
}

export default App
