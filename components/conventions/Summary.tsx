interface ConventionSummaryProps {
  conventionId: string;
}
export default function ConventionSummary({conventionId}: ConventionSummaryProps) {
  return (
    <>
      <h1>概要</h1>
      {conventionId}
    </>
  )
}