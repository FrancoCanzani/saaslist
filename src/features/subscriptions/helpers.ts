export const getPlanName = (planType: string) => {
  switch (planType) {
    case "daily":
      return "Daily Boost";
    case "monthly":
      return "Growth Plan";
    case "lifetime":
      return "Lifetime";
    default:
      return planType;
  }
};
