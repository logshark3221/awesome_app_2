import { useWindowDimensions } from 'react-native';

export function useScreen() {
  const { width, height, fontScale, scale } = useWindowDimensions();

  return {
    windowWidth: width,
    windowHeight: height,
    fontScale: fontScale,
    scale: scale,
  };
}