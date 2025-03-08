import { Match } from "@/types/match";
import { createContext, ReactNode, useContext, useState } from "react";

interface MatchContextType {
  match: Match | null;
  setMatch: (result: Match) => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const [ match, setMatch ] = useState<Match | null>(null);

  return (
    <MatchContext.Provider value={{ match, setMatch}}>
      {children}
    </MatchContext.Provider>
  )
};

export const useMatchContext = () => {
  const context = useContext(MatchContext);

  if (!context) {
    throw new Error("useMatchContext must be used within a MatchProvider");
  }

  return context;
};