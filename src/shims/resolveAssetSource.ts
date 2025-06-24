export default function resolveAssetSource(source: number | string | { uri: string }) {
  if (typeof source === 'number') {
    return { uri: source };
  }
  return source;
} 