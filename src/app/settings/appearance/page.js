import ThemePicker from "@/components/ThemePicker";

function page() {
  return (
    <div className="m-auto w-[60%] py-20">
      <h1 className="mb-3 text-xl font-[500]">Appearance</h1>
      <h2 className="text-sm text-text_light">
        Manage settings for your application appearance
      </h2>
      <div className="my-10 h-[2px] bg-gray-300"></div>
      <h2 className="mb-3 text-xl font-[500]">Theme</h2>
      <h3 className="mb-12 text-sm text-text_light">
        The theme will apply to every page on this application
      </h3>
      <ThemePicker />
    </div>
  );
}

export default page;
