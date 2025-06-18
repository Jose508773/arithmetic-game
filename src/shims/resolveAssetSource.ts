export default function resolveAssetSource(source: any) {
  if (typeof source === 'number') {
    return { uri: source };
  }
  return source;
} 