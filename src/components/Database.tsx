import React from "react";

// mui
import { Tabs, Tab, Box } from "@mui/material";

// utils
import { isNilOrEmpty } from "@/utils";

// constants
import { NOTES_LABELS } from "@/constants";

// types
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  currentTab?: string;
  tabName?: string;
}

const DATABASE_TABS_SECTIONS = {
  [NOTES_LABELS.import]: {
    title: NOTES_LABELS.import,
    description: NOTES_LABELS.importDescription,
    component: React.lazy(() => import("./DatabaseImport")),
  },
  [NOTES_LABELS.export]: {
    title: NOTES_LABELS.export,
    description: NOTES_LABELS.exportDescription,
    component: React.lazy(() => import("./DatabaseExport")),
  },
  [NOTES_LABELS.purge]: {
    title: NOTES_LABELS.purge,
    description: NOTES_LABELS.purgeDescription,
    component: React.lazy(() => import("./DatabasePurge")),
  },
};

function CustomTabPanel(props: TabPanelProps) {
  const {
    children,
    currentTab = "",
    tabName = "",
    index = 0,
    ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={currentTab !== tabName}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {currentTab === tabName && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const DatabaseTabs = (): React.ReactElement => {
  const [currentTab, setCurrentTab] = React.useState(NOTES_LABELS.import);

  return (
    <>
      <Tabs
        value={currentTab}
        onChange={(_, newValue) => setCurrentTab(newValue)}
      >
        {Object.keys(DATABASE_TABS_SECTIONS).map((key) => (
          <Tab
            key={key}
            label={DATABASE_TABS_SECTIONS[key].title}
            value={key}
          />
        ))}
      </Tabs>
      {Object.keys(DATABASE_TABS_SECTIONS).map((tabName, index) => {
        const SectionComponent =
          tabName in DATABASE_TABS_SECTIONS
            ? DATABASE_TABS_SECTIONS[tabName]?.component
            : null;
        const description =
          tabName in DATABASE_TABS_SECTIONS
            ? DATABASE_TABS_SECTIONS[tabName].description
            : "";
        return (
          <CustomTabPanel
            key={`database-tabpanel-${index}`}
            currentTab={currentTab}
            tabName={tabName}
            index={index}
          >
            <React.Suspense fallback={<div>{NOTES_LABELS.loading}</div>}>
              {!isNilOrEmpty(SectionComponent) && SectionComponent ? (
                <SectionComponent description={description} />
              ) : null}
            </React.Suspense>
          </CustomTabPanel>
        );
      })}
    </>
  );
};

const Database: React.FC = () => {
  return (
    <Box>
      <DatabaseTabs />
    </Box>
  );
};

export default Database;
