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

const Account = (): React.ReactElement => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h5">Loading...</Typography>
      </Container>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h5">Please log in to view your account</Typography>
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
        Account
      </Typography>

      {/* User Profile Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Profile Information
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
                  <Chip label="Verified" size="small" color="success" />
                )}
              </Box>

              {user.updated_at && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Last updated: {formatDate(user.updated_at)}
                  </Typography>
                </Box>
              )}

              {user.sub && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    User ID: {user.sub}
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
            Additional Information
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
          App Settings
        </Typography>
        <AppSettings />
      </Paper>
    </Container>
  );
};
export default Account;
