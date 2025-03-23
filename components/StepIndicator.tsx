interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = ["試合結果登録", "得点者入力", "アシスト者入力", "MOM入力"];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                currentStep >= index + 1 ? "bg-blue-500 text-white": "bg-gray-300 text-black"
              }`}
            >
              {index + 1}
            </div>
            <span className="ml-2">{step}</span>
            {/* {index < steps.length - 1 && <div className="w-10 h-1 bg-gray-300 mx-2" />} */}
          </div>
        ))}
      </div>
    </>
  )
};
