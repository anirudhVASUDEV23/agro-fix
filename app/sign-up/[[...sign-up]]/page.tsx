import { SignUp } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="px-4 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto flex justify-center align-center">
      <SignUp signInFallbackRedirectUrl={"/dashboard"} />
    </div>
  );
};

export default page;
