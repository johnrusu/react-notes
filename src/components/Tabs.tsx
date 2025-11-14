import React, { useState } from "react";

// mui
import { Box, Tab, Tabs as MuiTabs } from "@mui/material";

// types
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface TabItem {
  label: string;
  content: React.ReactNode;
  icon?: React.ReactElement;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: number;
  onChange?: (index: number) => void;
  variant?: "standard" | "scrollable" | "fullWidth";
  orientation?: "horizontal" | "vertical";
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      className="w-full"
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab = 0,
  onChange,
  variant = "standard",
  orientation = "horizontal",
}): React.ReactElement => {
  const [value, setValue] = useState<number>(defaultTab);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const a11yProps = (index: number) => {
    return {
      id: `tab-${index}`,
      "aria-controls": `tabpanel-${index}`,
    };
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: orientation === "vertical" ? "flex" : "block",
      }}
    >
      <MuiTabs
        value={value}
        onChange={handleChange}
        variant={variant}
        orientation={orientation}
        aria-label="tabs"
        sx={{
          borderBottom: orientation === "horizontal" ? 1 : 0,
          borderRight: orientation === "vertical" ? 1 : 0,
          borderColor: "divider",
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            icon={tab.icon}
            iconPosition="start"
            disabled={tab.disabled}
            {...a11yProps(index)}
          />
        ))}
      </MuiTabs>

      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
};

export default Tabs;
