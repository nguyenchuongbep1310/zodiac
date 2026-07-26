"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Clock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCalculateChart } from "@/lib/hooks/useCharts";
import { useToast } from "@/components/ui/Toast";
import tzlookup from "tz-lookup";

export function HeroSection() {
  const router = useRouter();
  const calculateChart = useCalculateChart();
  const { error: toastError } = useToast();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [geoResults, setGeoResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (city.length > 2 && showDropdown) {
      const timeout = setTimeout(async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=5`);
          const data = await res.json();
          setGeoResults(data);
        } catch {
          setGeoResults([]);
        }
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      setGeoResults([]);
    }
  }, [city, showDropdown]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city || !date || !time) {
      toastError("Missing fields", "Please fill out all fields.");
      return;
    }

    // Format date from MM/DD/YYYY to YYYY-MM-DD
    let formattedDate = date;
    if (date.includes("/")) {
      const parts = date.split("/");
      if (parts.length === 3) {
        // Assuming MM/DD/YYYY
        formattedDate = `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
      }
    }

    setIsLoading(true);
    try {
      // Geocode city
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          city
        )}&format=json&limit=1`
      );
      const geoData = await res.json();
      if (!geoData || geoData.length === 0) {
        toastError("Location not found", "Could not find that city.");
        setIsLoading(false);
        return;
      }

      const lat = parseFloat(geoData[0].lat);
      const lon = parseFloat(geoData[0].lon);
      const resolvedCity = geoData[0].display_name.split(",")[0];

      let tz = "UTC";
      try {
        tz = tzlookup(lat, lon);
      } catch {
        // Fallback
      }

      // Calculate chart
      const chart = await calculateChart.mutateAsync({
        name,
        birth_date: formattedDate,
        birth_time: time,
        timezone: tz,
        latitude: lat,
        longitude: lon,
        city: resolvedCity,
      });

      router.push(`/charts/${chart.id}`);
    } catch (err: any) {
      toastError("Failed to calculate chart", err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      {/* Background warm glowing accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-dusty-rose/20 dark:bg-dusty-rose/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-teal-muted/20 dark:bg-teal-muted/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 flex flex-col items-center"
        >
          <span className="inline-block py-1 px-3 rounded-full border border-teal-muted/30 bg-teal-muted/10 text-teal-muted dark:text-warm-cream/80 text-xs font-semibold uppercase tracking-widest mb-6">
            The New Standard in Astrology
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-mystic-dark dark:text-warm-cream leading-[1.1] tracking-tight">
            Discover Your <br className="hidden md:block" />
            <span className="italic font-light text-dusty-rose">Cosmic</span> Blueprint
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 font-light"
        >
          Unlock the secrets of your natal chart with state-of-the-art calculations and deeply personalized interpretations designed for the modern mystic.
        </motion.p>

        {/* Glassmorphism Quick Start Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="w-full max-w-3xl bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-mystic-dark/5"
        >
          <form onSubmit={handleStart} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First Name"
                required
                className="w-full bg-white/50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-dusty-rose/50 transition-shadow"
              />
            </div>
            
            <div className="relative z-50">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Birth Location"
                required
                autoComplete="off"
                className="w-full relative z-0 bg-white/50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-dusty-rose/50 transition-shadow"
              />
              {/* Autocomplete Dropdown */}
              {showDropdown && geoResults.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-black/90 backdrop-blur-lg border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden text-left max-h-60 overflow-y-auto">
                  {geoResults.map((result, i) => (
                    <li
                      key={i}
                      className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer text-sm text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-white/5 last:border-0 transition-colors"
                      onClick={() => {
                        setCity(result.display_name.split(",")[0]);
                        setShowDropdown(false);
                      }}
                    >
                      {result.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Birth Date (MM/DD/YYYY or YYYY-MM-DD)"
                required
                className="w-full bg-white/50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-dusty-rose/50 transition-shadow"
              />
            </div>

            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Birth Time"
                required
                className="w-full bg-white/50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-dusty-rose/50 transition-shadow"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="md:col-span-2 mt-2 w-full flex items-center justify-center gap-2 bg-mystic-dark dark:bg-warm-cream text-warm-cream dark:text-mystic-dark font-medium text-lg rounded-xl py-4 transition-all hover:bg-slate-800 dark:hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mystic-dark dark:focus:ring-offset-black disabled:opacity-70"
            >
              {isLoading ? "Calculating..." : "Reveal Your Chart"}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
          
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Your data is strictly confidential and never shared.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
