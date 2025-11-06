export const getMyEnterprise = (member: {
  id: string;
  idEnterprise?: string | null;
  enterprises: {
    id: string;
  }[];
}) => {
  return (
    member.enterprises.find(
      (enterprise) => enterprise.id === member.idEnterprise,
    ) ?? null
  );
};
