import TopAssist from "./AssistRanking";
import TopScorer from "./ScorerRanking";
import Table from "./Table";

interface ConventionSummaryProps {
  conventionId: string;
}

export default function ConventionSummary({conventionId}: ConventionSummaryProps) {

  return (
    <>
      <Table conventionId={conventionId} />
      <TopScorer conventionId={conventionId} />
      <TopAssist conventionId={conventionId} />
    </>
  )
}