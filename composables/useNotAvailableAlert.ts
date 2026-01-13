export const useNotAvailableAlert = () => {
  const showNotAvailableAlert = () => {
    alert(
      "Het programmaboekje is nog niet beschikbaar voor dit jaar. Stay tuned!",
    );
  };

  return { showNotAvailableAlert };
};
