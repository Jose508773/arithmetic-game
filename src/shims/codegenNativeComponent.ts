export default function codegenNativeComponent<T>(name: string) {
  return name as unknown as T;
} 