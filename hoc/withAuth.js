import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkSession = async () => {
        try {
          const response = await fetch("/api/getSession");
          if (!response.ok) {
            const errorMessage = `Error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
          }

          const data = await response.json();
          if (!data.userId) {
            throw new Error("Session data is invalid or userId missing");
          }

          setIsLoading(false);
        } catch (error) {
          router.push("/UserPage/LoginPage");
        }
      };

      checkSession();
    }, [router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
