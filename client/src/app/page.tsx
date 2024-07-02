import Input from "@/components/Input";

export default function Home() {
  return (
    <div>
      <Input />
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-white px-6 py-20 text-center sm:px-16 sm:shadow-sm">
          <p className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Didn't find component you were looking for?
          </p>

          <form action="/search">
            <label className="mx-auto mt-8 relative bg-white min-w-sm max-w-2xl flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-2xl gap-2 shadow-2xl focus-within:border-gray-300">
              <input
                id="search-bar"
                placeholder="your keyword here"
                name="q"
                className="px-6 py-2 w-full rounded-md flex-1 outline-none bg-white"
                required
              />
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-black border-black text-white fill-white active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-xl transition-all"
              >
                <div className="flex items-center transition-all opacity-1">
                  <span className="text-sm font-semibold whitespace-nowrap truncate mx-auto">
                    Search
                  </span>
                </div>
              </button>
            </label>
          </form>

          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle
              cx="512"
              cy="512"
              r="512"
              fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
              fill-opacity="0.7"
            ></circle>
            <defs>
              <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                <stop stop-color="#3b82f6"></stop>
                <stop offset="1" stop-color="#1d4ed8"></stop>
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
