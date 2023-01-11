import {createContext} from "react";
import React from "react";

const SettingsContext = createContext(null);

function SettingsProvider({children, settings}) {
  return <SettingsContext.Provider value={{ settings }}>{children}</SettingsContext.Provider>
}

function useSettings() {
  const context = React.useContext(SettingsContext);
  return {
    ...context.settings
  }
}

export {SettingsProvider, useSettings}