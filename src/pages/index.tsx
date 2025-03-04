import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LocationType } from "@/lib/types/LocationType";
import { useRouter } from "next/router";
import Image from "next/image";
import { Roboto_Condensed } from "next/font/google";
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: "300",
});

export default function Home() {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [open, setOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMedScreen, setIsMedScreen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const mobile_mediaQuery = window.matchMedia("(max-width: 600px)");
    const tablet_mediaQuery = window.matchMedia("(max-width: 810px)");
    const mobile_handleMediaQueryChange = () =>
      setIsSmallScreen(mobile_mediaQuery.matches);
    mobile_handleMediaQueryChange();
    mobile_mediaQuery.addEventListener("change", mobile_handleMediaQueryChange);
    const tablet_handleMediaQueryChange = () =>
      setIsMedScreen(tablet_mediaQuery.matches);
    tablet_handleMediaQueryChange();
    tablet_mediaQuery.addEventListener("change", tablet_handleMediaQueryChange);
    if (query.length < 3) {
      setLocations([]);
      setOpen(false);
      return;
    }

    let debounce: NodeJS.Timeout;

    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/location/locationdetail?query=${query}`
        );
        const data = await response.json();

        // console.log("API Response:", data);

        if (data && Array.isArray(data.results)) {
          setLocations(data.results);
          setOpen(data.results.length > 0);

          if (data.results.length > 0) {
            setLongitude(data.results[0].longitude);
            setLatitude(data.results[0].latitude);
          }
        } else {
          console.error("Unexpected response format:", data);
          setLocations([]);
          setOpen(false);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
      setLoading(false);
    };

    debounce = setTimeout(fetchLocations, 300);
    return () => {
      clearTimeout(debounce);
      mobile_mediaQuery.removeEventListener(
        "change",
        mobile_handleMediaQueryChange
      );
      tablet_mediaQuery.removeEventListener(
        "change",
        tablet_handleMediaQueryChange
      );
    };
  }, [query]);
  const handleSearch = () => {
    if (longitude !== 0 && latitude !== 0) {
      router.push(
        `/weather?lat=${latitude}&lon=${longitude}
        &loc=${locations[0].name}
        &pop=${locations[0].population}
        &country=${locations[0].country}
        &timezone=${locations[0].timezone}`
      );
    }
  };
  return (
    <div
      className={`flex justify-center items-center h-screen-minus-logo gap-0`}
    >
      <Popover open={open}>
        <PopoverTrigger asChild>
          <Input
            type="text"
            placeholder="location."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              fontSize: isMedScreen
                ? isSmallScreen
                  ? "24px"
                  : "48px"
                : "32px",
            }}
            className={cn(
              "w-70 sm:w-220 md:w-180 lg:w-220 h-[67px] shadow-none text-white bg-transparent",
              "border-8 border-white rounded-none focus:outline-none focus:border-white",
              "translate-x-1",
              robotoCondensed.className
            )}
          />
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-68 sm:w-220 md:w-178 lg:w-218 p-2 -translate-x-1",
            "shadow-lg rounded-none bg-transparent text-white border-8 border-white",
            robotoCondensed.className
          )}
        >
          <ScrollArea className="h-48">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : locations.length > 0 ? (
              locations.map((location) => (
                <p
                  key={location.id}
                  className={cn(
                    "p-2 hover:border-1 border-white cursor-pointer rounded-none",
                    "text-2xl"
                  )}
                  onMouseDown={() => {
                    setQuery(location.name);
                    setOpen(false);
                  }}
                >
                  {location.name}, {location.admin1 || "Unknown"},{" "}
                  {location.country}
                </p>
              ))
            ) : (
              <p className="text-center text-gray-500">No results found</p>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <Button
        onClick={handleSearch}
        className="w-[74px] h-[74px] bg-transparent shadow-none text-white hover:bg-transparent p-0 border-0"
      >
        <Image
          src="/search.png"
          width={100}
          height={100}
          alt="search"
          className="hover:opacity-88 cursor-pointer w-full h-[73.5px]"
        />
      </Button>
    </div>
  );
}
