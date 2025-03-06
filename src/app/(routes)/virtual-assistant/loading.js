import Spinner from "@/app/ui-components/common/Spinner";

function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner />
    </div>
  );
}

export default Loading;
