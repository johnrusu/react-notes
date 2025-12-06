import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import VerifiedIcon from "@mui/icons-material/Verified";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// components
import AppSettings from "@/components/AppSettings";
import { AnimationsLoader } from "@/components";

// animations
import loadingAnimation from "@/assets/animations/loading.json";

// constants
import { ACCOUNT_PAGE } from "@/constants";

const Account = (): React.ReactElement => {
  const { user, isAuthenticated, isLoading } = useAuth0();

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

  if (!isAuthenticated || !user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h5">{ACCOUNT_PAGE.loginRequired}</Typography>
      </Container>
    );
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
        {ACCOUNT_PAGE.pageTitle}
      </Typography>

      {/* User Profile Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          {ACCOUNT_PAGE.sections.profile}
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar
              src={user.picture}
              alt={user.name}
              sx={{
                width: 150,
                height: 150,
                border: "4px solid",
                borderColor: "primary.main",
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {user.name}
                  {user.email_verified && (
                    <VerifiedIcon
                      sx={{
                        ml: 1,
                        color: "primary.main",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user.nickname && `@${user.nickname}`}
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon color="action" />
                <Typography variant="body1">{user.email}</Typography>
                {user.email_verified && (
                  <Chip
                    label={ACCOUNT_PAGE.labels.verified}
                    size="small"
                    color="success"
                  />
                )}
              </Box>

              {user.updated_at && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {ACCOUNT_PAGE.labels.lastUpdated}{" "}
                    {formatDate(user.updated_at)}
                  </Typography>
                </Box>
              )}

              {user.sub && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {ACCOUNT_PAGE.labels.userId} {user.sub}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Additional User Metadata */}
      {user.user_metadata && Object.keys(user.user_metadata).length > 0 && (
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            {ACCOUNT_PAGE.sections.additionalInfo}
          </Typography>
          <Stack spacing={2}>
            {Object.entries(user.user_metadata).map(([key, value]) => (
              <Box key={key}>
                <Typography variant="subtitle2" color="text.secondary">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </Typography>
                <Typography variant="body1">{String(value)}</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      {/* App Settings Section */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          {ACCOUNT_PAGE.sections.appSettings}
        </Typography>
        <AppSettings />
      </Paper>
    </Container>
  );
};
export default Account;
