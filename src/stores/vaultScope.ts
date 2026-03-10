let currentVaultId = "v1";
const changeCallbacks = new Set<() => void>();

export function getVaultKey(baseKey: string): string {
  return `${baseKey}-${currentVaultId}`;
}

export function getCurrentVaultId(): string {
  return currentVaultId;
}

export function setCurrentVault(id: string) {
  if (id === currentVaultId) return;
  currentVaultId = id;
  changeCallbacks.forEach((cb) => cb());
}

export function onVaultChange(callback: () => void): () => void {
  changeCallbacks.add(callback);
  return () => changeCallbacks.delete(callback);
}
