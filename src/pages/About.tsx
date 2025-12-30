import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  Card,
  CardContent,
  CardHeader,
  CardActions,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import CodeIcon from "@mui/icons-material/Code";
import SpeedIcon from "@mui/icons-material/Speed";
import StorageIcon from "@mui/icons-material/Storage";
import LanguageIcon from "@mui/icons-material/Language";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { ABOUT_PAGE } from "../constants";

const About = (): React.ReactElement => {
  const featureIcons = [<CodeIcon />, <SpeedIcon />, <StorageIcon />];
  const featuresWithIcons = ABOUT_PAGE.features.map((feature, index) => ({
    ...feature,
    icon: featureIcons[index] || <CodeIcon />,
  }));

  return (
    <Container maxWidth="lg">
      <Card sx={{ p: 2 }}>
        <CardHeader
          title={ABOUT_PAGE.pageTitle}
          subheader={ABOUT_PAGE.subtitle}
        />
        <CardContent>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {ABOUT_PAGE.sectionsTitle.features}
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              sx={{ mt: 3 }}
            >
              {featuresWithIcons.map((feature) => (
                <Box
                  key={feature.title}
                  sx={{
                    flex: 1,
                    p: 4,
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    boxShadow: 1,
                  }}
                >
                  <Box sx={{ color: "primary.main", mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {ABOUT_PAGE.sectionsTitle.technologies}
          </Typography>
          <Box
            sx={{
              flex: 1,
              p: 4,
              borderRadius: 2,
              bgcolor: "background.paper",
              boxShadow: 1,
              mb: 6,
            }}
          >
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {ABOUT_PAGE.technologies.map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>

          <Typography variant="h6" sx={{ mb: 2 }}>
            {ABOUT_PAGE.sectionsTitle.developer}
          </Typography>
          <Box
            sx={{
              flex: 1,
              p: 4,
              borderRadius: 2,
              bgcolor: "background.paper",
              boxShadow: 1,
              mb: 6,
            }}
          >
            <Typography variant="h5" fontWeight="600" gutterBottom>
              {ABOUT_PAGE.developer.name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              {ABOUT_PAGE.developer.title}
            </Typography>
            {ABOUT_PAGE.developer.description.map((paragraph, index) => (
              <Typography key={index} variant="body1" paragraph>
                {paragraph}
              </Typography>
            ))}
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              gap={2}
              sx={{ mt: 3 }}
            >
              {ABOUT_PAGE.developer.links.map((link) => (
                <Button
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  color={link.color as any}
                  startIcon={
                    link.icon === "language" ? (
                      <LanguageIcon />
                    ) : link.icon === "github" ? (
                      <GitHubIcon />
                    ) : link.icon === "linkedin" ? (
                      <LinkedInIcon />
                    ) : null
                  }
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          </Box>

          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Typography variant="h5" gutterBottom>
              {ABOUT_PAGE.openSource.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {ABOUT_PAGE.openSource.description}
            </Typography>
            <Button
              href={ABOUT_PAGE.openSource.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              startIcon={<GitHubIcon />}
            >
              {ABOUT_PAGE.openSource.linkText}
            </Button>
          </Box>
        </CardContent>
        <CardActions
          sx={{ textAlign: "center", justifyContent: "center", pb: 4 }}
        >
          <Typography variant="body2" color="text.secondary">
            {ABOUT_PAGE.footer(new Date().getFullYear())}
          </Typography>
        </CardActions>
      </Card>
    </Container>
  );
};

export default About;
