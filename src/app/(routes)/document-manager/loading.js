import Spinner from "@/app/ui-components/Spinner";

function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner />
    </div>
  );
}

export default Loading;
