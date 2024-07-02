import { scrapeAndStoreProduct } from "@/lib/actions";
import Button from "./Button";
import CheckBox from "./CheckBox";

const Input = () => {
  function VerifyArea(area: string) {
    if (area == "Amazon") {
    }
    if (area == "Google") {
    }
    if (area == "SkyScanner") {
    }
    return false;
  }
  const handleAction = async (formData: FormData) => {
    "use server";
    // await new Promise((resolve) => setTimeout(resolve, 5000));

    const link = formData.get("link") as string;
    const area = formData.get("area") as string;
    if (!link || !area) return;

    if (!VerifyArea(area))
      throw new Error("Please enter the Website to Scrape");

    return;

    let amazonRegex = /^(https?:\/\/)?(www\.)?(amazon\.com)\/.*$/i;

    // Test if the URL matches the Amazon regex
    amazonRegex.test(link);
    await scrapeAndStoreProduct(link);
  };
  return (
    <form action={handleAction}>
      <div className=" flex flex-col items-center justify-center">
        <div className="flex flex-row gap-4"></div>
        <CheckBox />

        <div className=" border-2 border-black my-4 rounded w-1/2 flex flex-row shadow-md">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 outline-0 w-full"
            name="link"
            required
          />
          <Button className="text-nowrap text-center border-l-2 border-black p-2 hover:bg-slate-300">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Input;

//  "https://www.amazon.com/Apple-2024-MacBook-15-inch-Laptop/dp/B0CX23YF4Q/ref=sr_1_2?crid=GJCHT81JIJ1&dib=eyJ2IjoiMSJ9.XNgLkob2WMyz71hsjF7GXr8LrWTyu-r_r594-SSH7ImvUbxr_rpAzszh-PHvCAFiOx3rxxbOe5yDg7tkgOZT3nPSGwgtI65-_TmopGSyw18TPWgZINBlTEvCoBW60SewLuFT_gBl6YNsu7cq5E4ewoHp81W2U8oKJMRthT3fNPZkfWhXllMxS6sRYhZ-wqGrMjdK3oPBxVjYiyQlicFxHfEbzKaZJB0UfkoUHPn2EZc.0AztG-vwBjjJc0U7-igcl88Hn1xvUSM4mC_NKKVVbrY&dib_tag=se&keywords=macbook+air&qid=1718210097&sprefix=macbook%2Caps%2C582&sr=8-2"
