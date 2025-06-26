import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const useUserSession = (onSessionReady) => {
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionRes = await fetch("/api/getSession");
        const sessionData = await sessionRes.json();

        if (sessionRes.ok && sessionData.userId) {
          setUserId(sessionData.userId);
          onSessionReady?.(sessionData.userId);
        } else {
          router.push("/UserPage/LoginPage");
        }
      } catch (error) {
        router.push("/UserPage/LoginPage");
      }
    };

    fetchSessionData();
  }, [router, onSessionReady]);

  return userId;
};

export default useUserSession;
