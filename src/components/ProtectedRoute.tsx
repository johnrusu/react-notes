import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Typography } from "@mui/material";

// components
import { AnimationsLoader } from "@/components";

// animations
import loadingAnimation from "@/assets/animations/loading.json";

// constants
import { ACCOUNT_PAGE } from "@/constants";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

/**
 * ProtectedRoute component that wraps routes requiring authentication.
 * Displays a loading state while checking authentication status,
 * and a login prompt for unauthenticated users.
 *
 * Usage:
 * <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <AnimationsLoader
          options={{
            animationData: loadingAnimation,
            loop: true,
            autoplay: true,
            style: { width: 150, height: 150 },
            rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
          }}
        />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h5">{ACCOUNT_PAGE.loginRequired}</Typography>
      </Container>
    );
  }

  return children;
};

export default ProtectedRoute;
