import { SpinningLogo } from "@/icons/SpinningLogo";
import "@/index.css";
import useLoadingStore from "@/store/loadingStore";

interface LoadingProps {
  isLoading?: boolean;
}
export function LoadingMain({ isLoading }: LoadingProps) {
  const loadingStore = useLoadingStore((state) => state.isLoading);

  if (isLoading || loadingStore) {
    return (
      <div className="fixed  left-0 top-0 z-[100] flex h-screen w-screen items-center  bg-white bg-opacity-60">
        <SpinningLogo />
      </div>
    );
  }

  return <></>;
}
